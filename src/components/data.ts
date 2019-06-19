import { results } from './results';

interface Metrics {
  url: string;
  responseStart: number; // firstByte
  loadEventEnd: number; // pageLoad
  domInteractive: number; // interactive
  firstPaint: number;
  firstContentfulPaint: number; // use Performance.metrics injected into webpage
  firstMeaningfulPaint: number;
  custom: AMPCustomStatistics;
}

export interface AMPJavaScriptSizeEntry {
  url: string;
  size: number;
}

export interface AMPCustomStatistics {
  ampJavascriptSize: AMPJavaScriptSizeEntry[];
  installStyles: number[];
  visible: number;
  onFirstVisible: number;
  makeBodyVisible: number;
  windowLoadEvent: number;
  firstViewportReady: number;
}
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
  device: results.device,
  networkSpeed: results.networkSpeed,
  metrics: parseMetrics(results.metrics),
};
