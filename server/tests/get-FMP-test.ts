import test from 'ava';
import { PuppeteerMetrics } from "../scrape-metrics/puppeteer-enum";
import { getFMP } from '../scrape-metrics/get-FMP';
import puppeteer from 'puppeteer';

test('First Meaningful Paint returned', async t => {
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
  const puppeteerMetrics = (await client.send('Performance.getMetrics')) as PuppeteerMetrics;

  const firstMeaningfulPaint = getFMP(puppeteerMetrics); 

  const firstMeaningfulPaintExpected = () => {
    let fmp: number = 0;
    let navStart: number = 0;

    //Finding metric values
    for (const metric of puppeteerMetrics.metrics) {
      if (metric.name === 'FirstMeaningfulPaint') {
        fmp = metric.value * 1000;
      } else if (metric.name === 'NavigationStart') {
        navStart = metric.value * 1000;
      }
    }

    //If metrics aren't found 0 will be returned
    if (fmp === 0 && navStart === 0) {
      return 0;
    }

    return Math.round((fmp - navStart) * 1000) / 1000;
    }

  t.deepEqual(firstMeaningfulPaint, firstMeaningfulPaintExpected());
})