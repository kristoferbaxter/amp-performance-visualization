import { results } from './results';

interface Metrics {
  [k: string]: any;
}

function filterBadData(metricsArr: Metrics[]) {
  return metricsArr.filter(metrics => !(Object.values(metrics)[1] < 50));
}

function parseMetrics(metricsArr: Metrics[]) {
  const goodMetrics = filterBadData(metricsArr);
  for (let i = 1; i < Object.keys(goodMetrics[0]).length; i++) {
    for (const metrics of goodMetrics) {
      delete metrics.url;
    }
  }
  return goodMetrics;
}

export const data = {
  device: results.device,
  networkSpeed: results.networkSpeed,
  metrics: parseMetrics(results.metrics),
};
