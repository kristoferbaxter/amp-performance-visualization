import { TestPass, TimeMetrics } from '../../../shared/interfaces';
import { HistogramDataResult } from './types';

interface GroupedMetrics {
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

function filterBadData(numberArray: number[]): number[] {
  for (let i = 0; i < numberArray.length; i++) {
    while (numberArray[i] < 0) {
      numberArray.splice(i, 1);
    }
  }
  return numberArray;
}

function getFrequencyInterval(baseMetrics: TimeMetrics[], experimentMetrics: TimeMetrics[], graphChoice: keyof TimeMetrics): number {
  const groupedBaseMetrics = groupResultByMetrics(baseMetrics);
  const specificBaseMetric = filterBadData(sortNeededData(groupedBaseMetrics, graphChoice));
  const groupedExpMetrics = groupResultByMetrics(experimentMetrics);
  const specificExpMetric = filterBadData(sortNeededData(groupedExpMetrics, graphChoice));
  const basefrequencyInterval = Math.pow(
    10,
    Math.ceil(specificBaseMetric[specificBaseMetric.length - 1] - specificBaseMetric[0]).toString().length - 1,
  );
  const experimentalFrequencyInterval = Math.pow(
    10,
    Math.ceil(specificExpMetric[specificExpMetric.length - 1] - specificExpMetric[0]).toString().length - 1,
  );
  return basefrequencyInterval < experimentalFrequencyInterval ? basefrequencyInterval : experimentalFrequencyInterval;
}

function getTimeMetricsByFrequency(metrics: TimeMetrics[], graphChoice: keyof TimeMetrics, frequencyInterval: number): HistogramData {
  const groupedMetrics = groupResultByMetrics(metrics);
  const specificMetric = filterBadData(sortNeededData(groupedMetrics, graphChoice));
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
export function consolidate(baseMetrics: TestPass, experimentMetrics: TestPass, graphChoice: keyof TimeMetrics): HistogramDataResult {
  const { results: baseResults } = baseMetrics;
  const { results: experimentResults } = experimentMetrics;
  const flattenedBaseResults = baseResults.map(result => result.performance).flat();
  const flattenedExperimentResults = experimentResults.map(result => result.performance).flat();
  const frequencyInterval = getFrequencyInterval(flattenedBaseResults, flattenedExperimentResults, graphChoice);
  const baseFrequency = getTimeMetricsByFrequency(flattenedBaseResults, graphChoice, frequencyInterval);
  const experimentalFrequency = getTimeMetricsByFrequency(flattenedExperimentResults, graphChoice, frequencyInterval);
  return {
    baseFrequency,
    experimentFrequency: experimentalFrequency,
  };
}
