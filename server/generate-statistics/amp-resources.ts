import { Page } from 'puppeteer';
import { AMPEntry } from '../../shared-interfaces/metrics-results';

export function getResources(page: Page): Promise<AMPEntry[]> {
  return page.evaluate(_ => {
    const TRANSFER_SIZE_URL_PREFIX = 'https://cdn.ampproject.org/';

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

    return ampTransferSizes;
  });
}
