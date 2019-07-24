import { Page } from 'puppeteer';
import { PuppeteerMetrics } from './puppeteer-enum';

export interface PaintMetrics {
  firstPaint: number;
  firstContentfulPaint: number;
  firstMeaningfulPaint: number;
}

export function getPaintTiming(page: Page, puppeteerMetrics: PuppeteerMetrics): Promise<PaintMetrics> {

  function getFMP(puppeteer: PuppeteerMetrics): number {
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

  const firstMeaningfulPaint = getFMP(puppeteerMetrics);

  //Passing firstMeaningfulPaint so it can be returned along with other paint metrics
  return page.evaluate((firstMeaningfulPaint: number) => {
    const paintMetrics: number[] = [];
    (performance.getEntriesByType('paint') as PerformanceResourceTiming[]).forEach(
      (item: PerformanceResourceTiming): void => {
        if (item.name.startsWith('first-')) {
          paintMetrics.push(Math.round(item.startTime * 1000) / 1000);
        }
      },
    );

    return {
      firstPaint: paintMetrics[0],
      firstContentfulPaint: paintMetrics[1],
      firstMeaningfulPaint,
    };
  }, firstMeaningfulPaint);
}
