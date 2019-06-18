import { results } from './results';

interface Metrics {
  [k: string]: any;
}
interface ParsedData {
  [k: string]: number;
}

function filterBadData(metricsArr: Metrics[]) {
  return metricsArr.filter(metrics => !(Object.values(metrics)[1] < 50));
}

function parseMetrics(metricsArr: Metrics[]) {
  const parsed: ParsedData[] = [];
  const goodMetrics = filterBadData(metricsArr);
  for (let i = 1; i < Object.keys(goodMetrics[0]).length; i++) {
    for (const metrics of goodMetrics) {
      delete metrics.url;
      parsed.push(metrics);
    }
  }
  return parsed;
}

export const data = {
  device: results.device,
  networkSpeed: results.networkSpeed,
  metrics: parseMetrics(results.metrics),
};
