import test from 'ava';
import puppeteer from 'puppeteer';
import { getPerformanceTiming, PerformanceTiming } from '../scrape-metrics/performance-timing';

test('Performance timing returned', async t => {
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

  const performanceTiming: PerformanceTiming = await getPerformanceTiming(page);

  const performanceTimingExpected: PerformanceTiming = await page.evaluate(_ => {
    const results = JSON.parse(JSON.stringify(performance.timing));

    return {
      responseStart: results.responseStart - results.navigationStart,
      loadEventEnd: results.loadEventEnd - results.navigationStart,
    };
  });

  t.deepEqual(performanceTiming, performanceTimingExpected);
})