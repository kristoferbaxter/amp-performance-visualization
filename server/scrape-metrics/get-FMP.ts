import { PuppeteerMetrics } from "./puppeteer-enum";

export function getFMP(puppeteer: PuppeteerMetrics): number {
  let fmp: number = 0;
  let navStart: number = 0;

  //Finding metric values
  for (const metric of puppeteer.metrics) {
    if (metric.name === 'FirstMeaningfulPaint') {
      fmp = metric.value * 1000;
    } else if (metric.name === 'NavigationStart') {
      navStart = metric.value * 1000;
    }
  }

  //If metrics aren't found 0 will be returned
  if (fmp === 0 && navStart === 0) {
    return 0;
  }

  return Math.round((fmp - navStart) * 1000) / 1000;
}