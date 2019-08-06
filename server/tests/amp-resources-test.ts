import test from 'ava';
import puppeteer from 'puppeteer';
import { getResources } from '../scrape-metrics/amp-resources';
import { AMPEntry } from '../../shared/interfaces';

test('AMP Resources returned', async t => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 3932160,
    uploadThroughput: 1966080,
    latency: 2,
  });

  // waits until the page is fully loaded
  try {
    await page.goto('https://amp.dev', {
      waitUntil: 'networkidle0',
    });
  } catch (e) {
    await browser.close();
    return;
  }

  const resources: AMPEntry[] = await getResources(page);
  
  const resourcesExpectation: AMPEntry[] = await page.evaluate(_ => {
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
  })

  t.deepEqual(resources, resourcesExpectation);
})