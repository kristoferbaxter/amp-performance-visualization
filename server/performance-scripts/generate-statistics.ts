import puppeteer from 'puppeteer';
import Statistics, { AMPJavaScriptSizeEntry } from './performance-data';

// Don't have the information on how to properly retrieve these metrics
const TEMP_OUTPUT = 0;

export default async function generate(page: puppeteer.Page): Promise<Statistics> {
  return await page.evaluate(
    (): Statistics => {
      // Performance Metric results
      const results = JSON.parse(JSON.stringify(performance.timing));

      // Transfer Size for all AMP Javascript Resources
      const ampTransferSizes: AMPJavaScriptSizeEntry[] = [];
      (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).forEach((item: PerformanceResourceTiming): void => {
        if (item.initiatorType === 'script' && item.name.startsWith('https://cdn.ampproject.org/')) {
          ampTransferSizes.push({
            url: item.name,
            size: item.transferSize,
          });
        }
      });

      // Custom AMP Performance Marks
      const markNames: string[] = ['is', 'e_is', 'visible', 'ofv', 'mbv', 'ol', 'pc'];
      const performanceMarkArray: number[] = [];
      (performance.getEntriesByType('mark') as PerformanceMark[]).forEach((element: PerformanceMark): void => {
        for (const item of markNames) {
          if (element.name.startsWith(item)) {
            const markTime = Math.round(element.startTime * 1000) / 1000;
            performanceMarkArray.push(markTime);
          }
        }
      });

      return {
        url: document.location.href,
        responseStart: results.responseStart - results.navigationStart,
        loadEventEnd: results.loadEventEnd - results.navigationStart,
        domInteractive: TEMP_OUTPUT,
        firstPaint: TEMP_OUTPUT,
        firstContentfulPaint: TEMP_OUTPUT,
        firstMeaningfulPaint: TEMP_OUTPUT,
        custom: {
          ampJavascriptSize: ampTransferSizes,
          installStyles: [performanceMarkArray[0], performanceMarkArray[1]],
          visible: performanceMarkArray[2],
          onFirstVisible: performanceMarkArray[3],
          makeBodyVisible: performanceMarkArray[4],
          windowLoadEvent: performanceMarkArray[5],
          firstViewportReady: performanceMarkArray[6],
        },
      };
    },
  );
}
