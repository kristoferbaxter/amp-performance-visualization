import puppeteer from 'puppeteer';
import { AMPEntry } from '../../shared-interfaces/metrics-results';
import { Metrics } from './json-metrics';

export default async function generate(page: puppeteer.Page): Promise<Metrics> {
  return await page.evaluate(
    (): Metrics => {
      // Don't have the information on how to properly retrieve these metrics
      const TEMP_OUTPUT = 0;
      // to detect transfer sizes
      const tSizeURL = 'https://cdn.ampproject.org/';

      // Performance Metric results
      const results = JSON.parse(JSON.stringify(performance.timing));

      // Transfer Size for all AMP Javascript Resources
      const ampTransferSizes: AMPEntry[] = [];
      (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).forEach(
        (item: PerformanceResourceTiming): void => {
          if (item.initiatorType === 'script' && item.name.startsWith(tSizeURL)) {
            ampTransferSizes.push({
              url: item.name,
              size: item.transferSize,
            });
          }
        },
      );

      // Custom AMP Performance Marks
      const markNames: string[] = ['is', 'e_is', 'visible', 'ofv', 'mbv', 'ol', 'pc'];
      const performanceMarkArray: number[] = [];
      (performance.getEntriesByType('mark') as PerformanceMark[]).forEach(
        (element: PerformanceMark): void => {
          for (const item of markNames) {
            if (element.name.startsWith(item)) {
              const markTime = Math.round(element.startTime * 1000) / 1000;
              performanceMarkArray.push(markTime);
            }
          }
        },
      );

      return {
        graphableData: {
          responseStart: results.responseStart - results.navigationStart,
          loadEventEnd: results.loadEventEnd - results.navigationStart,
          domInteractive: TEMP_OUTPUT,
          firstPaint: TEMP_OUTPUT,
          firstContentfulPaint: TEMP_OUTPUT,
          firstMeaningfulPaint: TEMP_OUTPUT,
          installStyles: performanceMarkArray[0],
          installStylesDuration: performanceMarkArray[1] - performanceMarkArray[0],
          visible: performanceMarkArray[2],
          onFirstVisible: performanceMarkArray[3],
          makeBodyVisible: performanceMarkArray[4],
          windowLoadEvent: performanceMarkArray[5],
          firstViewportReady: performanceMarkArray[6],
        },
        tableData: ampTransferSizes,
      };
    },
  );
}
