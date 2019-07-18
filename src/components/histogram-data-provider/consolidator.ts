import { PerformanceMarkers, PerformancePassResults } from '../../../shared/interfaces';
import { HistogramDataResult } from './types';

interface GroupedMetrics {
  responseStart: number[];
  loadEventEnd: number[];
  domInteractive: number[];
  firstPaint: number[];
  firstContentfulPaint: number[];
  firstMeaningfulPaint: number[];
  installStyles: number[];
  installStylesDuration: number[];
  visible: number[];
  onFirstVisible: number[];
  makeBodyVisible: number[];
  windowLoadEvent: number[];
  firstViewportReady: number[];
}
export interface HistogramData {
  [key: string]: number;
}

function groupResultByMetrics(metrics: PerformanceMarkers[]): GroupedMetrics {
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

function sortNeededData(data: GroupedMetrics, graphChoice: keyof GroupedMetrics): number[] {
  const numArray: number[] = [];
  for (const value of data[graphChoice]) {
    numArray.push(value);
  }
  return numArray.sort((a, b) => a - b);
}

function getPerformanceMarkersByFrequency(metrics: PerformanceMarkers[], graphChoice: keyof PerformanceMarkers): HistogramData {
  const groupedMetrics = groupResultByMetrics(metrics);
  const specificMetric = sortNeededData(groupedMetrics, graphChoice);
  console.log(groupedMetrics);
  const frequencyInterval = Math.pow(10, Math.ceil(specificMetric[specificMetric.length - 1].toString().length - 1));
  const result: HistogramData = {};
  let previousInterval = 0;
  let currentInterval = frequencyInterval;
  while (currentInterval <= specificMetric[specificMetric.length - 1] + frequencyInterval) {
    let count = 0;
    for (const num of specificMetric) {
      if (num > previousInterval && num <= currentInterval) {
        count++;
      }
    }
    result[`${previousInterval + 1} - ${currentInterval}`] = count;
    previousInterval = currentInterval;
    currentInterval += frequencyInterval;
  }
  return result;
}
export function consolidate(
  baseMetrics: PerformancePassResults,
  experimentMetrics: PerformancePassResults,
  graphChoice: keyof PerformanceMarkers,
): HistogramDataResult {
  const { results: baseResults } = baseMetrics;
  const { results: experimentResults } = experimentMetrics;
  const flattenedBaseResults = baseResults.map(result => result.performance).flat();
  const flattenedExperimentResults = experimentResults.map(result => result.performance).flat();
  const p50BaseFrequency = getPerformanceMarkersByFrequency(flattenedBaseResults, graphChoice);
  const p50ExperimentalFrequency = getPerformanceMarkersByFrequency(flattenedExperimentResults, graphChoice);
  return {
    baseFrequency: p50BaseFrequency,
    experimentFrequency: p50ExperimentalFrequency,
  };
}
