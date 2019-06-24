import { Metrics, MultipleRuns, Results } from '../../shared-interfaces/metrics-results';
import getResults from './json-metrics';

const DEVICE_NAME = 'iPhone 8';
// haven't figured out how to get device info from user, so its hardcoded for now

async function getMetricsFromURLs(urls: string[], downSpeed: number, upSpeed: number, latency: number): Promise<Metrics[]> {
  const metricsArray: Array<Promise<Metrics>> = [];

  urls.forEach(url => metricsArray.push(getResults(url, downSpeed, upSpeed, latency)));

  return await Promise.all(metricsArray);
}

export default async function multiRunMetrics(urls: string[], downSpeed: number, upSpeed: number, latency: number): Promise<Results> {
  const results = await Promise.all([
    getMetricsFromURLs(urls, downSpeed, upSpeed, latency),
    getMetricsFromURLs(urls, downSpeed, upSpeed, latency),
    getMetricsFromURLs(urls, downSpeed, upSpeed, latency),
  ]);

  const allURLArray: MultipleRuns[] = [];

  for (let index = 0; index < urls.length; index++) {
    const metricArray: Metrics[] = [];
    for (const result of results) {
      metricArray.push(result[index]);
    }
    const info = {
      url: urls[index],
      runs: metricArray,
    };
    allURLArray.push(info);
  }

  return {
    device: DEVICE_NAME,
    networkSpeed: `downspeed: ${downSpeed}kbps`,
    metrics: allURLArray,
  };
}
