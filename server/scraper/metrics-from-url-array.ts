import { exec } from 'child_process';
import { AMPEntry, Results, TestPass, TimeMetrics } from '../../shared/interfaces';
import { DOMCache } from '../cache/dom-cache';
import { Polka } from '../polka';
import { NamedNetworkPreset } from '../configuration/network-configuration';
import { TestConfiguration, VersionConfiguration } from '../configuration/test-configuration';
import getResults, { Metrics, NetworkJSON } from './url-scraper';

const PolkaInstanceWrapper = new Polka();
// haven't figured out how to get device info from user, so its hardcoded for now
const DEVICE_NAME = 'iPhone 8';

async function getMetricsFromURLs(
  version: VersionConfiguration,
  networkPreset: NamedNetworkPreset,
  domCache: DOMCache,
  urls: string[],
  progressBar: ProgressBar,
  TestConfiguration: TestConfiguration,
): Promise<Metrics[][]> {
  const documentCache = await domCache.documentCache(version.rtv);
  const documentCacheLocation = documentCache.location;
  const polkaInstance = await PolkaInstanceWrapper.get(version.rtv, documentCacheLocation);

  let singleUrlMetrics: Metrics[] = [];
  const metricsFromURLArray: Metrics[][] = [];
  for (const url of urls) {
    for (let iterator = 0; iterator < TestConfiguration.executions; iterator += TestConfiguration.concurrency) {
      const parallelExecutions: number = Math.min(TestConfiguration.concurrency, TestConfiguration.executions - iterator);
      const parallelCaptures: Metrics[] = await Promise.all(
        Array.from({ length: parallelExecutions }, _ => {
          progressBar.tick();
          return getResults(url, networkPreset, `http://localhost:${polkaInstance.port}/${documentCache.encodeUrl(url)}`, progressBar);
          }
        ),
      );

      singleUrlMetrics.push(...parallelCaptures);
    }
    metricsFromURLArray.push(singleUrlMetrics);
    singleUrlMetrics = [];
  }
  return metricsFromURLArray;
}

export default async function multiRunMetrics(
  version: VersionConfiguration,
  TestConfiguration: TestConfiguration,
  networkPreset: NamedNetworkPreset,
  domCache: DOMCache,
  urls: string[],
  progressBar: ProgressBar,
): Promise<TestPass> {
  const awaitedMetrics: Metrics[][] = await getMetricsFromURLs(version, networkPreset, domCache, urls, progressBar, TestConfiguration);

  const results: Results[] = urls.map(
    (url: string, index: number): Results => {
      const performance: TimeMetrics[] = [];
      for (const metrics of awaitedMetrics) {
        for (let i = 0; i < metrics.length; i++) {
          performance.push(metrics[i].graphableData);
        }
        break;
      }
      const amp: AMPEntry[] = awaitedMetrics[0][index].tableData;
      return {
        url,
        performance,
        amp,
      };
    },
  );

  return {
    device: DEVICE_NAME,
    networkSpeed: `downspeed: ${networkPreset.downloadThroughput} | upspeed: ${networkPreset.uploadThroughput} | latency: ${
      networkPreset.latency
    }`,
    results,
  };
}
