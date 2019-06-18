import { results } from './results';

interface Metrics {
  url: string;
  firstByte: number;
  pageLoad: number;
  interactive: number;
  firstContentfulPaint: number;
}

function getMedian(numArray: number[]): number {
  const sortedArr = numArray.sort((a, b) => a - b);
  const midpoint = sortedArr.length / 2;
  return sortedArr.length % 2 !== 0 ? sortedArr[midpoint] : (sortedArr[midpoint - 1] + sortedArr[midpoint]) / 2;
}

function filterBadData(metricsArr: Metrics[]) {
  return metricsArr.filter(metrics => !(Object.values(metrics)[1] <= 0));
}

function aggregateMetrics(metricsArr: Metrics[]) {
  const aggregate: { [k: string]: number } = {};
  const goodMetrics = filterBadData(metricsArr);
  for (let i = 1; i < Object.keys(goodMetrics[0]).length; i++) {
    const metrics = [];
    for (const metric of goodMetrics) {
      metrics.push(Object.values(metric)[i]);
    }
    aggregate[Object.keys(goodMetrics[0])[i]] = getMedian(metrics);
  }
  return aggregate;
}

export const data = {
  // gets the device, network speed, and metrics from the results json
  device: results.device,
  networkSpeed: results.networkSpeed,
  metrics: aggregateMetrics(results.metrics),
};
