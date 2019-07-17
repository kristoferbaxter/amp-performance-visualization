/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ProgressBar from 'progress';
import puppeteer, { CDPSession, Page } from 'puppeteer';
import { AMPResourceWeight, URLPerformanceMetrics } from '../shared/interfaces';
import { NamedNetworkPreset } from './configuration/network-configuration';
import { TestConfiguration, VersionConfiguration } from './configuration/test-configuration';
import { DOMCache } from './dom-cache';
import { AMPMarkers, getAMPMarkers } from './evaluate-performance/amp-markers';
import { getResources } from './evaluate-performance/amp-resources';
import { getPaintTiming, PaintTiming } from './evaluate-performance/paint-timing';
import { getPerformanceTiming } from './evaluate-performance/performance-timing';
import { Polka } from './polka';

// TODO: Move this to a `device.json` configuration.
const WINDOW_RESOLUTION = {
  x: 411,
  y: 731,
};

const PolkaInstanceWrapper = new Polka();

/**
 * Captures necessary metrics from a single page, in a new browser instance.
 * @param networkPreset
 * @param url
 * @param cachedUrl
 */
async function capturePage(networkPreset: NamedNetworkPreset, url: string, cachedUrl: string): Promise<URLPerformanceMetrics> {
  const browser = await puppeteer.launch({
    headless: true, // Can toggle this to see a Chrome instance on your machine.
    args: [`--window-size=${WINDOW_RESOLUTION.x},${WINDOW_RESOLUTION.y}`, '--no-sandbox'],
  });
  const page: Page = await browser.newPage();
  await page.setViewport({
    width: WINDOW_RESOLUTION.x,
    height: WINDOW_RESOLUTION.y,
  });
  const client: CDPSession = await page.target().createCDPSession();

  await client.send('Performance.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: networkPreset.downloadThroughput,
    uploadThroughput: networkPreset.uploadThroughput,
    latency: networkPreset.latency,
  });

  try {
    await page.goto(cachedUrl, {
      waitUntil: 'networkidle2',
    });
    // Additionally wait for our async function to complete loading.
    // TODO: This can be made reliable with the following changes:
    // 1. During capture/modification stage, store the amp extensions for the document.
    //    e.g. new URL('https://cdn.ampproject.org/rtv/031907022322580/v0/amp-auto-lightbox-0.1.js').pathname.last.
    // 2. When analyizing performance of the document, wait until `Object.keys(window.ampExtendedElements)` contains
    //    all of the extensions.
    // await page.waitForFunction('window.AMP.ampdoc.pf.includes("amp-auto-lightbox")');

    const resources: AMPResourceWeight[] = await getResources(page);
    const performanceTiming: PerformanceTiming = await getPerformanceTiming(page);
    const paintTiming: PaintTiming = await getPaintTiming(page);
    const ampMarkers: AMPMarkers = await getAMPMarkers(page);
    await browser.close();

    return {
      url,
      amp: resources,
      performance: [
        {
          responseStart: performanceTiming.responseStart - performanceTiming.navigationStart,
          loadEventEnd: performanceTiming.loadEventEnd - performanceTiming.navigationStart,
          domInteractive: 0, // INCORRECT
          ...paintTiming,
          ...ampMarkers,
        },
      ],
    };
  } catch (reason) {
    console.log(`Error retrieving performance data for: ${url}`, reason);
  }

  await browser.close();
  return {
    url,
    amp: [],
    performance: [],
  };
}

/**
 * Captures a list of URLs data for a specific network preset.
 * @param version
 * @param executions
 * @param networkPreset
 * @param domCache
 * @param urls
 */
async function captureAtNetworkPreset(
  version: VersionConfiguration,
  TestConfiguration: TestConfiguration,
  networkPreset: NamedNetworkPreset,
  domCache: DOMCache,
  urls: string[],
  progressBar: ProgressBar,
): Promise<URLPerformanceMetrics[]> {
  const documentCache = await domCache.documentCache(version.rtv);
  const documentCacheLocation = documentCache.location;
  const polkaInstance = await PolkaInstanceWrapper.get(version.rtv, documentCacheLocation);
  const URLPerformanceMetrics: URLPerformanceMetrics[] = [];

  for (const url of urls) {
    // We have a server running with each url available.
    // Now tell Puppeteer to run against the server.
    const captured: Array<URLPerformanceMetrics> = [];
    for (let iterator=0; iterator < TestConfiguration.executions; iterator = iterator + TestConfiguration.concurrency) {
    const parallelExecutions: number = Math.min(TestConfiguration.concurrency, TestConfiguration.executions - (iterator + TestConfiguration.concurrency));
        const parallelCaptures: Array<URLPerformanceMetrics> = await Promise.all(Array.from({ length: parallelExecutions }, _ =>
          capturePage(networkPreset, url, `http://localhost:${polkaInstance.port}/${documentCache.encodeUrl(url)}`),
        ));
        captured.push(...parallelCaptures);
        progressBar.tick(parallelExecutions, '=');
      }

    URLPerformanceMetrics.push({
      url,
      amp: captured[0].amp,
      performance: captured.map(capture => capture.performance[0]),
    });
  }

  return URLPerformanceMetrics;
}

/**
 * Capture the URLs requested from the local version of the hosted documents.
 * @param versions
 * @param networkPreset
 * @param TestConfiguration
 * @param domCache
 * @param urls
 */
export function capture(
  version: VersionConfiguration,
  networkPreset: NamedNetworkPreset,
  TestConfiguration: TestConfiguration,
  domCache: DOMCache,
  urls: string[],
  progressBar: ProgressBar,
): Promise<URLPerformanceMetrics[]> {
  // Array<Promise<Array<URLPerformanceMetrics>>>
return captureAtNetworkPreset(version, TestConfiguration, networkPreset, domCache, urls, progressBar);}

/*
import puppeteer from 'puppeteer';
import { AMPEntry, PuppeteerMetrics } from '../../shared/interfaces/metrics-results';
import { Metrics } from './json-metrics';

export default async function generate(page: puppeteer.Page, customMetrics: PuppeteerMetrics): Promise<Metrics> {
  // firstMeaningfulPaint. if the variable is named firstMeaningfulPaint it produces a shadowing error in TSLint
  // const fMP: number = Math.round((customMetrics.metrics[30].value - customMetrics.metrics[32].value) * 1000);

    // There is no Javascript semantic that tells typescript that this code is running in a separate thread, so the code below has to be inlined instead of making it a variable. Without this, a shadowing error would occur.
  }, Math.round((customMetrics.metrics[30].value - customMetrics.metrics[32].value) * 1000));
}
*/
