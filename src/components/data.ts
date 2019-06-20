import { Metrics } from '../../shared-interfaces/metricsResults';
import { results } from './results';

export interface ParsedData {
  responseStart: number; // firstByte
  loadEventEnd: number; // pageLoad
  domInteractive: number; // interactive
  firstPaint: number;
  firstContentfulPaint: number; // use Performance.metrics injected into webpage
  firstMeaningfulPaint: number;
}

function filterBadData(metricsArr: Metrics[]): Metrics[] {
  return metricsArr.filter(metrics => !(metrics.responseStart <= 0));
}

function parseMetrics(metricsArr: Metrics[]): ParsedData[] {
  const parsed = [];
  const goodMetrics = filterBadData(metricsArr);
  for (const metrics of goodMetrics) {
    delete metrics.url;
    delete metrics.custom;
    parsed.push(metrics);
  }
  return parsed;
}

// function parseMetrics(metricsArr: Metrics[]): ParsedData[] {
//   const parsed = [];
//   const goodMetrics = filterBadData(metricsArr);
//   for (const metrics of goodMetrics) {
//     let metric: ParsedData = {
//       responseStart: 0, // firstByte
//       loadEventEnd: 0, // pageLoad
//       domInteractive: 0, // interactive
//       firstPaint: 0,
//       firstContentfulPaint: 0, // use Performance.metrics injected into webpage
//       firstMeaningfulPaint: 0,
//     }
//     for(let i = 0; i < Object.keys(metrics).length; i++){
//       if(Object.keys(metrics)[i] !== "url" && Object.keys(metrics)[i] !== "custom"){
//         metric[Object.keys(metrics)[i]] = Object.values(metrics)[i];
//       }
//     }
//     parsed.push(metric);
//   }
//   return parsed;
// }

export const data = {
  metrics: parseMetrics(results.metrics),
};
