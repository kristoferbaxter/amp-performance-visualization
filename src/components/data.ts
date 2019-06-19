import { Metrics } from '../../shared-interfaces/metricsResults';
import { results } from './results';

function getMedian(numArray: number[]): number {
  const sortedArr = numArray.sort((a, b) => a - b);
  const midpoint = Math.floor(sortedArr.length / 2);
  return sortedArr.length % 2 !== 0 ? sortedArr[midpoint] : (sortedArr[midpoint - 1] + sortedArr[midpoint]) / 2;
}

function filterBadData(metricsArr: Metrics[]) {
  return metricsArr.filter(metrics => !(metrics.responseStart <= 0));
}

function aggregateMetrics(metricsArr: Metrics[]) {
  const aggregate: { [k: string]: number } = {};
  const goodMetrics = filterBadData(metricsArr);
  for (let i = 1; i < Object.keys(goodMetrics[0]).length; i++) {
    const metrics = [];
    for (const metric of goodMetrics) {
      metrics.push(Object.values(metric)[i]);
    }
    if (Object.keys(goodMetrics[0])[i] !== 'custom') {
      aggregate[Object.keys(goodMetrics[0])[i]] = getMedian(metrics);
    }
  }
  return aggregate;
}

export const data = {
  // gets the device, network speed, and metrics from the results json
  device: results.device,
  networkSpeed: results.networkSpeed,
  metrics: aggregateMetrics(results.metrics),
};
