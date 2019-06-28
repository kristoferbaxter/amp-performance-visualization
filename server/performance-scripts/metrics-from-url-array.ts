import { AMPEntry, Results, TestPass, TimeMetrics } from '../../shared-interfaces/metrics-results';
import getResults, { Metrics } from './json-metrics';

const DEVICE_NAME = 'iPhone 8';
// haven't figured out how to get device info from user, so its hardcoded for now

async function getMetricsFromURLs(urls: string[], downSpeed: number, upSpeed: number, latency: number): Promise<Metrics[]> {
  const metricsArray: Array<Promise<Metrics>> = [];

  urls.forEach(url => metricsArray.push(getResults(url, downSpeed, upSpeed, latency)));

  return await Promise.all(metricsArray);
}

export default async function multiRunMetrics(
  urls: string[],
  downSpeed: number,
  upSpeed: number,
  latency: number,
  numberOfRuns: number = 3,
): Promise<TestPass> {
  const resultsArr: Array<Promise<Metrics[]>> = [];
  for (let i = 0; i < numberOfRuns; i++) {
    resultsArr.push(getMetricsFromURLs(urls, downSpeed, upSpeed, latency));
  }

  const results: Metrics[][] = await Promise.all(resultsArr);

  const allURLArray: Results[] = [];

  for (let index = 0; index < urls.length; index++) {
    const metricArray: TimeMetrics[] = [];
    let transferData: AMPEntry[] = [];
    for (const result of results) {
      metricArray.push(result[index].graphableData);
      if (transferData.length === 0) {
        transferData = result[index].tableData;
      }
    }
    const info = {
      url: urls[index],
      performance: metricArray,
      amp: transferData,
    };
    allURLArray.push(info);
  }

  return {
    device: DEVICE_NAME,
    networkSpeed: `downspeed: ${downSpeed}kbps | upspeed: ${upSpeed} | latency: ${latency}`,
    metrics: allURLArray,
  };
}
