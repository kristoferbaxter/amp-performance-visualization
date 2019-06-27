import puppeteer from 'puppeteer';
import { AMPJavaScriptSizeEntry, Metrics, PuppeteerMetrics } from '../../shared-interfaces/metrics-results';

export default async function generate(page: puppeteer.Page, customMetrics: PuppeteerMetrics): Promise<Metrics> {
  const fMP: number = Math.round((customMetrics.metrics[30].value - customMetrics.metrics[32].value) * 1000);
  return await page.evaluate((firstMeaningfulPaint): Metrics => {
    // Don't have the information on how to properly retrieve these metrics
    const TEMP_OUTPUT = 0;
    // to detect transfer sizes
    const tSizeURL = 'https://cdn.ampproject.org/';

    // Performance Metric results
    const results = JSON.parse(JSON.stringify(performance.timing));

    // Transfer Size for all AMP Javascript Resources
    const ampTransferSizes: AMPJavaScriptSizeEntry[] = [];
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

    // Transfer Size for all AMP Javascript Resources
    const paintMetrics: number[] = [];
    (performance.getEntriesByType('paint') as PerformanceResourceTiming[]).forEach(
      (item: PerformanceResourceTiming): void => {
        if (item.name.startsWith('first-')) {
          paintMetrics.push(Math.round(item.startTime * 1000) / 1000);
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

    const duration = Math.round((performanceMarkArray[1] - performanceMarkArray[0]) * 1000) / 1000;

    return {
      graphableData: {
        responseStart: results.responseStart - results.navigationStart,
        loadEventEnd: results.loadEventEnd - results.navigationStart,
        domInteractive: TEMP_OUTPUT,
        firstPaint: paintMetrics[0],
        firstContentfulPaint: paintMetrics[1],
        firstMeaningfulPaint: fMP,
        installStyles: performanceMarkArray[0],
        installStylesDuration: duration,
        visible: performanceMarkArray[2],
        onFirstVisible: performanceMarkArray[3],
        makeBodyVisible: performanceMarkArray[4],
        windowLoadEvent: performanceMarkArray[5],
        firstViewportReady: performanceMarkArray[6],
      },
      tableData: ampTransferSizes,
    };
  }, fMP);
}
