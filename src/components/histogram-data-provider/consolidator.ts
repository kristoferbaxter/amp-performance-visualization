import { TestPass, TimeMetrics } from '../../../shared/interfaces';
import { HistogramDataResult } from './types';

interface GroupedMetrics {
  responseStart: number[];
  loadEventEnd: number[];
  interactive: number[];
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

function groupResultByMetrics(metrics: TimeMetrics[]): GroupedMetrics {
  const reducer = (accumulator: any, currentValue: TimeMetrics) => {
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
    interactive: [],
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

function getTimeMetricsByFrequency(metrics: TimeMetrics[], graphChoice: keyof TimeMetrics, frequencyInterval: number = 1000): HistogramData {
  const groupedMetrics = groupResultByMetrics(metrics);
  const specificMetric = sortNeededData(groupedMetrics, graphChoice);
  const result: HistogramData = {};
  let previousInterval = 0;
  let currentInterval = frequencyInterval;
  while (currentInterval <= specificMetric[specificMetric.length] + frequencyInterval) {
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
  baseMetrics: TestPass,
  experimentMetrics: TestPass,
  graphChoice: keyof TimeMetrics,
  frequencyInterval: number,
): HistogramDataResult {
  const { results: baseResults } = baseMetrics;
  const { results: experimentResults } = experimentMetrics;
  const flattenedBaseResults = baseResults.map(result => result.performance).flat();
  const flattenedExperimentResults = experimentResults.map(result => result.performance).flat();
  const p50BaseFrequency = getTimeMetricsByFrequency(flattenedBaseResults, graphChoice, frequencyInterval);
  const p50ExperimentalFrequency = getTimeMetricsByFrequency(flattenedExperimentResults, graphChoice, frequencyInterval);
  return {
    baseFrequency: p50BaseFrequency,
    experimentFrequency: p50ExperimentalFrequency,
  };
}
