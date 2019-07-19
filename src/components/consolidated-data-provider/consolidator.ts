import { TestPass, TimeMetrics } from '../../../shared/interfaces';
import { ConsolidatedDataResult } from './types';

export interface GroupedMetrics {
  responseStart: number[];
  loadEventEnd: number[];
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

function groupResultByMetrics(metrics: TimeMetrics[]): GroupedMetrics {
  const reducer = (accumulator: any, currentValue: TimeMetrics) => {
    for (const key in currentValue) {
      if (currentValue.hasOwnProperty(key)) {
        // @ts-ignore
        accumulator[key].push(currentValue[key]);
      }
    }
    for (const key in accumulator) {
      if (accumulator.hasOwnProperty(key)) {
        accumulator[key] = filterBadData(accumulator[key]);
      }
    }
    return accumulator;
  };
  return metrics.reduce(reducer, {
    responseStart: [],
    loadEventEnd: [],
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

function filterBadData(numberArray: number[]): number[] {
  for (let i = 0; i < numberArray.length; i++) {
    while (numberArray[i] < 0) {
      numberArray.splice(i, 1);
    }
  }
  return numberArray;
}

function getTimeMetricsByAverage(metrics: TimeMetrics[]): TimeMetrics {
  const groupedMetrics = groupResultByMetrics(metrics);
  const result: TimeMetrics = {
    responseStart: 0,
    loadEventEnd: 0,
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
      result[key] = getAverage(filterBadData(groupedMetrics[key]));
    }
  }
  return result;
}
// create an array with the sta deviation of each metric
function createConfidenceArray(metrics: TimeMetrics[]): TimeMetrics {
  const groupedMetrics = groupResultByMetrics(metrics);
  const confidence: TimeMetrics = {
    responseStart: 0,
    loadEventEnd: 0,
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
      confidence[key] = calculateStandardDeviation(filterBadData(groupedMetrics[key]));
    }
  }
  return confidence;
}

function getAverage(numArray: number[]): number {
  let sum = 0;
  for (const num of numArray) {
    sum += num;
  }
  return sum / numArray.length;
}
// calculate the standard deviation given an array of numbers
function calculateStandardDeviation(numArray: number[]): number {
  const average = getAverage(numArray);
  const indivMean = [];
  for (const num of numArray) {
    indivMean.push(Math.pow(num - average, 2));
  }
  return Math.sqrt(getAverage(indivMean));
}

export function consolidate(baseMetrics: TestPass, experimentMetrics: TestPass): ConsolidatedDataResult {
  const { results: baseResults } = baseMetrics;
  const { results: experimentResults } = experimentMetrics;
  const flattenedBaseResults = baseResults.map(result => result.performance).flat();
  const flattenedExperimentResults = experimentResults.map(result => result.performance).flat();
  const p50BaseMetrics = groupResultByMetrics(flattenedBaseResults);
  const p50ExperimentalMetrics = groupResultByMetrics(flattenedExperimentResults);
  const baseStandardDeviation = createConfidenceArray(flattenedBaseResults);
  const experimentStandardDeviation = createConfidenceArray(flattenedExperimentResults);
  return {
    baseMetrics: p50BaseMetrics,
    experimentMetrics: p50ExperimentalMetrics,
    baseStandardDeviation,
    experimentStandardDeviation,
  };
}
