import { AMPEntry, Results, TestPass, TimeMetrics } from '../../shared-interfaces/metrics-results';
import getResults, { Metrics, NetworkJSON } from './json-metrics';

// haven't figured out how to get device info from user, so its hardcoded for now
const DEVICE_NAME = 'iPhone 8';

export interface URLFileJSON {
  urls: string[];
}

async function getMetricsFromURLs(parsedURLs: URLFileJSON, network: NetworkJSON): Promise<Metrics[]> {
  const metricsArray: Array<Promise<Metrics>> = parsedURLs.urls.map(url => getResults(url, network));
  return await Promise.all(metricsArray);
}

export default async function multiRunMetrics(parsedURLs: URLFileJSON, network: NetworkJSON, numberOfRuns: number): Promise<TestPass> {
  const awaitedMetrics: Metrics[][] = await Promise.all(Array.from({ length: numberOfRuns }, _ => getMetricsFromURLs(parsedURLs, network)));

  const results: Results[] = parsedURLs.urls.map(
    (url: string, index: number): Results => {
      const performance: TimeMetrics[] = awaitedMetrics.map(metrics => metrics[index].graphableData);
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
    networkSpeed: `downspeed: ${network.downSpeed}kbps | upspeed: ${network.upSpeed} | latency: ${network.latency}`,
    results,
  };
}
