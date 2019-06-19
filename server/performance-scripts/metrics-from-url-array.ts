import getResults from './json-metrics';
import Statistics from './performance-data';

export interface Results {
  device: string;
  networkSpeed: string;
  metrics: Statistics[];
}

const DEVICE_NAME = 'iPhone 8';
// haven't figured out how to get device info from user, so its hardcoded for now

export default async function getMetricsFromURLs(urls: string[], downSpeed: number, upSpeed: number, latency: number): Promise<Results> {
  const metricsArray: Array<Promise<Statistics>> = [];

  urls.forEach(url => metricsArray.push(getResults(url, downSpeed, upSpeed, latency)));

  return {
    device: DEVICE_NAME,
    networkSpeed: `downspeed: ${downSpeed}kbps`,
    metrics: await Promise.all(metricsArray),
  };
}
