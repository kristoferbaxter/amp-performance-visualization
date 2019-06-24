import { Metrics } from '../../shared-interfaces/metricsResults';
import { ParsedData } from '../../shared-interfaces/metricsResults';
import { results } from './results';

function filterBadData(metricsArr: Metrics[]): Metrics[] {
  return metricsArr.filter(metrics => !(metrics.responseStart <= 0));
}

function parseMetrics(metricsArr: Metrics[]): ParsedData[] {
  const parsed: ParsedData[] = [];
  const goodMetrics = filterBadData(metricsArr);
  for (const metrics of goodMetrics) {
    parsed.push({
      responseStart: metrics.responseStart,
      loadEventEnd: metrics.loadEventEnd,
      domInteractive: metrics.domInteractive,
      firstPaint: metrics.firstPaint,
      firstContentfulPaint: metrics.firstContentfulPaint,
      firstMeaningfulPaint: metrics.firstMeaningfulPaint,
    } as ParsedData);
  }
  return parsed;
}

export const data = {
  metrics: parseMetrics(results.metrics),
};
