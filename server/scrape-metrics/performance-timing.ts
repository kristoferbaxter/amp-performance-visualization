import { Page } from 'puppeteer';

export interface PerformanceTiming {
  responseStart: number;
  loadEventEnd: number;
}

/**
 * Use Puppeteer to retrieve performance timing from the current Page.
 * @param page
 */
export function getPerformanceTiming(page: Page): Promise<PerformanceTiming> {
  return page.evaluate(_ => {
    const results = JSON.parse(JSON.stringify(performance.timing));

    return {
      responseStart: results.responseStart - results.navigationStart,
      loadEventEnd: results.loadEventEnd - results.navigationStart,
    };
  });
}
