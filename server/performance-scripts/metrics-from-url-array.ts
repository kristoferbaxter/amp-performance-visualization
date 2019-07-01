import { AMPEntry, Results, TestPass, TimeMetrics } from '../../shared-interfaces/metrics-results';
import getResults, { Metrics } from './json-metrics';

const DEVICE_NAME = 'iPhone 8';
// haven't figured out how to get device info from user, so its hardcoded for now

async function getMetricsFromURLs(urls: string[], downSpeed: number, upSpeed: number, latency: number): Promise<Metrics[]> {
  const metricsArray: Array<Promise<Metrics>> = urls.map(url => getResults(url, downSpeed, upSpeed, latency));
  return await Promise.all(metricsArray);
}

export default async function multiRunMetrics(
  urls: string[],
  downSpeed: number,
  upSpeed: number,
  latency: number,
  numberOfRuns: number = 3,
): Promise<TestPass> {
  const awaitedMetrics: Metrics[][] = await Promise.all(
    Array.from({ length: numberOfRuns }, _ => getMetricsFromURLs(urls, downSpeed, upSpeed, latency)),
  );

  const results: Results[] = urls.map(
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
    networkSpeed: `downspeed: ${downSpeed}kbps | upspeed: ${upSpeed} | latency: ${latency}`,
    results,
  };
}
