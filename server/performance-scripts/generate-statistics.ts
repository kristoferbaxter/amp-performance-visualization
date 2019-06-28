import puppeteer from 'puppeteer';
import { AMPEntry, PuppeteerMetrics } from '../../shared-interfaces/metrics-results';
import { Metrics } from './json-metrics';

export default async function generate(page: puppeteer.Page, customMetrics: PuppeteerMetrics): Promise<Metrics> {
  // firstMeaningfulPaint. if the variable is named firstMeaningfulPaint it produces a shadowing error in TSLint
  // const fMP: number = Math.round((customMetrics.metrics[30].value - customMetrics.metrics[32].value) * 1000);
  return await page.evaluate((fMP): Metrics => {
    // Don't have the information on how to properly retrieve these metrics
    const TEMP_OUTPUT = 0;
    // to detect transfer sizes
    const TRANSFER_SIZE_URL_PREFIX = 'https://cdn.ampproject.org/';

    // `performance.timing` contains PerformanceResourceTiming data, which we need to generate a `Metrics` Object. However, within a Puppeteer environment, we must use stringify and parse to access it correctly.
    const results = JSON.parse(JSON.stringify(performance.timing));

    // Transfer Size for all AMP Javascript Resources
    const ampTransferSizes: AMPEntry[] = [];
    (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).forEach(
      (item: PerformanceResourceTiming): void => {
        if (item.initiatorType !== 'script' || !item.name.startsWith(TRANSFER_SIZE_URL_PREFIX)) {
          return;
        }
        ampTransferSizes.push({
          url: item.name,
          size: item.transferSize,
        });
      },
    );

    // First Paint and First Contentful Paint Metrics
    const paintMetrics: number[] = [];
    (performance.getEntriesByType('paint') as PerformanceResourceTiming[]).forEach(
      (item: PerformanceResourceTiming): void => {
        if (item.name.startsWith('first-')) {
          paintMetrics.push(Math.round(item.startTime * 1000) / 1000);
        }
      },
    );

    // Custom AMP Performance Marks
    const MARK_NAMES: string[] = ['is', 'e_is', 'visible', 'ofv', 'mbv', 'ol', 'pc'];
    const performanceMarkArray: number[] = [];
    (performance.getEntriesByType('mark') as PerformanceMark[]).forEach(
      (element: PerformanceMark): void => {
        for (const item of MARK_NAMES) {
          if (element.name.startsWith(item)) {
            const markTime = Math.round(element.startTime * 1000) / 1000;
            performanceMarkArray.push(markTime);
          }
        }
      },
    );

    const installStylesDuration = Math.round((performanceMarkArray[1] - performanceMarkArray[0]) * 1000) / 1000;

    return {
      graphableData: {
        responseStart: results.responseStart - results.navigationStart,
        loadEventEnd: results.loadEventEnd - results.navigationStart,
        domInteractive: TEMP_OUTPUT,
        firstPaint: paintMetrics[0],
        firstContentfulPaint: paintMetrics[1],
        firstMeaningfulPaint: fMP,
        installStyles: performanceMarkArray[0],
        installStylesDuration,
        visible: performanceMarkArray[2],
        onFirstVisible: performanceMarkArray[3],
        makeBodyVisible: performanceMarkArray[4],
        windowLoadEvent: performanceMarkArray[5],
        firstViewportReady: performanceMarkArray[6],
      },
      tableData: ampTransferSizes,
    };
    // There is no Javascript semantic that tells typescript that this code is running in a separate thread, so the code below has to be inlined instead of making it a variable. Without this, a shadowing error would occur.
  }, Math.round((customMetrics.metrics[30].value - customMetrics.metrics[32].value) * 1000));
}
