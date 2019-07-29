import { Page } from 'puppeteer';
import { PuppeteerMetrics } from './puppeteer-enum';
import { getFMP } from './get-FMP';

export interface PaintMetrics {
  firstPaint: number;
  firstContentfulPaint: number;
  firstMeaningfulPaint: number;
}

export function getPaintTiming(page: Page, puppeteerMetrics: PuppeteerMetrics): Promise<PaintMetrics> {
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
