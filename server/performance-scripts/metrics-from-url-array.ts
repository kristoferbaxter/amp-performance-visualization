import getResults from './json-metrics';
import Statistics from './performance-data';

interface runsObject {
  url: string,
  runs: Statistics[],
}

export interface Results {
  device: string;
  networkSpeed: string;
  metrics: Array<runsObject>;
}

const DEVICE_NAME = 'iPhone 8';
// haven't figured out how to get device info from user, so its hardcoded for now

async function getMetricsFromURLs(urls: string[], downSpeed: number, upSpeed: number, latency: number): Promise<Array<Statistics>> {
  const metricsArray: Array<Promise<Statistics>> = [];

  urls.forEach(url => metricsArray.push(getResults(url, downSpeed, upSpeed, latency)));

  return await Promise.all(metricsArray);
}

export default async function multiRunMetrics(urls: string[], downSpeed: number, upSpeed: number, latency: number): Promise<Results> {
  const results = await Promise.all([
    getMetricsFromURLs(urls, downSpeed, upSpeed, latency),
    getMetricsFromURLs(urls, downSpeed, upSpeed, latency),
    getMetricsFromURLs(urls, downSpeed, upSpeed, latency),
  ]);


  
  
  let allURLArray: runsObject[] = [];

  for (let index = 0; index < urls.length; index++) {
    let metricArray: Statistics[] = [];
    for(let result of results) {
      metricArray.push(result[index]);
    }
    let info = {
      url: urls[index],
      runs: metricArray,
    }
    allURLArray.push(info);
    // urlArray.length = 0;
  }

  return {
    device: DEVICE_NAME,
    networkSpeed: `downspeed: ${downSpeed}kbps`,
    metrics: allURLArray
  }
}