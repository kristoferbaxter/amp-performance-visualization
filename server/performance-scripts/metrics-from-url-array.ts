import getResults from './json-metrics';

interface Results {
  device: string;
  networkSpeed: string;
  metrics: string[];
}

const DEVICE_NAME = 'iPhone 8';
// haven't figured out how to get device info from user, so its hardcoded for now

export default async function getMetricsFromURLs(urls: string[], downSpeed: number, upSpeed: number, lat: number): Promise<Results> {
  const metricsArray: Array<Promise<any>> = [];

  urls.forEach(url => metricsArray.push(getResults(url, downSpeed, upSpeed, lat)));

  return {
    device: DEVICE_NAME,
    networkSpeed: `downspeed: ${downSpeed}kbps`,
    metrics: await Promise.all(metricsArray),
  };
}
