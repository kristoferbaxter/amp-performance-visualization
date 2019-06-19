import { Metrics } from '../../shared-interfaces/metricsResults';
import { results } from './results';

interface ParsedData {
  responseStart: number; // firstByte
  loadEventEnd: number; // pageLoad
  domInteractive: number; // interactive
  firstPaint: number;
  firstContentfulPaint: number; // use Performance.metrics injected into webpage
  firstMeaningfulPaint: number;
}

function filterBadData(metricsArr: Metrics[]) {
  return metricsArr.filter(metrics => !(metrics.responseStart <= 0));
}

function parseMetrics(metricsArr: Metrics[]) {
  const parsed: ParsedData[] = [];
  const goodMetrics = filterBadData(metricsArr);
  for (const metrics of goodMetrics) {
    delete metrics.url;
    delete metrics.custom;
    parsed.push(metrics);
  }
  return parsed;
}

export const data = {
  metrics: parseMetrics(results.metrics),
};
