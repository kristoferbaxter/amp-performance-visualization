import puppeteer from 'puppeteer';
import { AMPEntry, TimeMetrics } from '../../shared/interfaces';
import { NamedNetworkPreset } from '../configuration/network-configuration';
import { AMPMarkers, getAMPMarkers } from '../scrape-metrics/amp-markers';
import { getResources } from '../scrape-metrics/amp-resources';
import { getPaintTiming, PaintMetrics } from '../scrape-metrics/paint-metrics';
import { getPerformanceTiming, PerformanceTiming } from '../scrape-metrics/performance-timing';
import { PuppeteerMetrics } from '../scrape-metrics/puppeteer-enum';
import { failedPageEval, failedPageGoTo, invalidAMP, snailURL } from './return-failed';

export interface Metrics {
  graphableData: TimeMetrics;
  tableData: AMPEntry[];
}

export interface NetworkJSON {
  downSpeed: number;
  upSpeed: number;
  latency: number;
}

type ResultsCalculator = (url: string, networkPreset: NamedNetworkPreset, cachedUrl: string, progressBar: ProgressBar) => Promise<Metrics>;

const NAV_TIMEOUT = 240000;
// networkidle0 means that there are no more than 0 network connections for atleast 500 milliseconds
const NAVIGATION_COMPLETE = 'networkidle0';
// TODO: Move this to a `device.json` configuration.
const WINDOW_RESOLUTION = {
  x: 411,
  y: 731,
};

const getMetrics: ResultsCalculator = async (
  url: string,
  networkPreset: NamedNetworkPreset,
  cachedUrl: string,
  progressBar: ProgressBar,
): Promise<Metrics> => {
  const browser = await puppeteer.launch({
    headless: true, // Can toggle this to see a Chrome instance on your machine.
    args: [`--window-size=${WINDOW_RESOLUTION.x},${WINDOW_RESOLUTION.y}`, '--no-sandbox'],
  });
  const page = await browser.newPage();
  // Sets the navigation timeout to 2 minutes
  // await page.setDefaultNavigationTimeout(NAV_TIMEOUT);

  /*
    Emulating a Wifi connection
    "/8" is included because network speed is commonly measured in bits/s
    DevTools expects throughputs in bytes/s
  */
  const client = await page.target().createCDPSession();
  await client.send('Performance.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: networkPreset.downloadThroughput,
    uploadThroughput: networkPreset.uploadThroughput,
    latency: networkPreset.latency,
  });

  // waits until the page is fully loaded
  try {
    await page.goto(url, {
      waitUntil: NAVIGATION_COMPLETE,
    });
  } catch (e) {
    await browser.close();
    return failedPageGoTo(url);
  }

  const puppeteerMetrics = (await client.send('Performance.getMetrics')) as PuppeteerMetrics;

  // Returning info
  try {
    const resources: AMPEntry[] = await getResources(page);
    const performanceTiming: PerformanceTiming = await getPerformanceTiming(page);
    const paintTiming: PaintMetrics = await getPaintTiming(page, puppeteerMetrics);
    const ampMarkers: AMPMarkers = await getAMPMarkers(page);

    return {
      graphableData: {
        ...performanceTiming,
        ...paintTiming,
        ...ampMarkers,
      },
      tableData: resources,
    };
  } catch (e) {
    console.log(e);
    return failedPageEval(url);
  } finally {
    await browser.close();
  }
};

const getResults: ResultsCalculator = async (url: string, networkPreset: NamedNetworkPreset, cachedUrl: string, progressBar: ProgressBar) => {
  const pageMetrics = getMetrics(url, networkPreset, cachedUrl, progressBar);
  // const slowURL: Promise<Metrics> = new Promise(resolve => {
  //   setTimeout(() => {
  //     resolve(snailURL(url));
  //   }, NAV_TIMEOUT - 100);
  // });
  return pageMetrics;
  // return Promise.race([slowURL, pageMetrics]);
};

export default getResults;
