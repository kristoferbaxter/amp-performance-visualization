import test from 'ava';
import puppeteer from 'puppeteer';
import { PuppeteerMetrics } from '../scrape-metrics/puppeteer-enum';
import { PaintMetrics, getPaintTiming } from '../scrape-metrics/paint-metrics';
import { getFMP } from '../scrape-metrics/get-FMP';

test('Paint Metrics returned', async t=> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();
  await client.send('Performance.enable');
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
  const puppeteerMetrics = (await client.send('Performance.getMetrics')) as PuppeteerMetrics;

  const paintTiming: PaintMetrics = await getPaintTiming(page, puppeteerMetrics);

  const firstMeaningfulPaint = getFMP(puppeteerMetrics); 
  const paintTimingExpected: PaintMetrics = await page.evaluate((firstMeaningfulPaint: number)=> {
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

  t.deepEqual(paintTiming, paintTimingExpected);
})