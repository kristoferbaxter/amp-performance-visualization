import { PerformanceMarkers, PerformancePassResults, URLPerformanceMetrics } from '../../../shared/interfaces';
import { ConsolidatedDataResult } from './types';

function groupResultByMetrics(metrics: PerformanceMarkers) {
  const reducer = (accumulator: any, currentValue: PerformanceMarkers) => {
    for (const key in currentValue) {
      if (currentValue.hasOwnProperty(key)) {
        // @ts-ignore
        accumulator[key].push(currentValue[key]);
      }
    }
    return accumulator;
  };

  return metrics.reduce(reducer, {
    responseStart: [],
    loadEventEnd: [],
    domInteractive: [],
    firstPaint: [],
    firstContentfulPaint: [],
    firstMeaningfulPaint: [],
    installStyles: [],
    installStylesDuration: [],
    visible: [],
    onFirstVisible: [],
    makeBodyVisible: [],
    windowLoadEvent: [],
    firstViewportReady: [],
  });
}

function percentile(metrics: number[], p: number) {
  if (metrics.length === 0) {
    return 0;
  }
  if (p <= 0) {
    return metrics[0];
  }
  if (p >= 1) {
    return metrics[metrics.length - 1];
  }
  metrics = metrics.sort();

  const index = (metrics.length - 1) * p;
  const lower = Math.floor(index);
  const upper = lower + 1;
  const weight = index % 1;

  if (upper >= metrics.length) {
    return metrics[lower];
  }
  return metrics[lower] * (1 - weight) + metrics[upper] * weight;
}

function getPerformanceMarkersByPercentile(metrics: PerformanceMarkers, p: number): PerformanceMarkers {
  const groupedMetrics = groupResultByMetrics(metrics);
  const result: PerformanceMarkers = {
    responseStart: 0,
    loadEventEnd: 0,
    domInteractive: 0,
    firstPaint: 0,
    firstContentfulPaint: 0,
    firstMeaningfulPaint: 0,
    installStyles: 0,
    installStylesDuration: 0,
    visible: 0,
    onFirstVisible: 0,
    makeBodyVisible: 0,
    windowLoadEvent: 0,
    firstViewportReady: 0,
  };
  for (const key in groupedMetrics) {
    if (groupedMetrics.hasOwnProperty(key)) {
      // @ts-ignore
      result[key] = percentile(groupedMetrics[key], p);
    }
  }
  return result;
}

export function consolidate(
  baseMetrics: PerformancePassResults,
  experimentMetrics: PerformancePassResults,
  metricPercentile: number,
): ConsolidatedDataResult {
  const { results: baseResults } = baseMetrics;
  const { results: experimentResults } = experimentMetrics;
  const flattenedBaseResults = baseResults.map(result => result.performance).flat();
  const flattenedExperimentResults = experimentResults.map(result => result.performance).flat();
  const p50BaseMetrics = getPerformanceMarkersByPercentile(flattenedBaseResults, metricPercentile);
  const p50ExperimentalMetrics = getPerformanceMarkersByPercentile(flattenedExperimentResults, metricPercentile);

  return {
    baseMetrics: p50BaseMetrics,
    experimentMetrics: p50ExperimentalMetrics,
  };
}
