/**
 * @fileoverview Description of this file.
 */
import { launch } from 'puppeteer';
import { getTimeToFirstByte, getTimeToPageLoaded } from './page-metrics-evaluation';
import Statistics, { notAMP, snailURL, failedPageGoTo } from './performance-data';

export default async (url: string, downSpeed: number, upSpeed: number, lat: number): Promise<Statistics> => {
  const browser = await launch();
  const page = await browser.newPage();
  // Sets the navigation timeout to 2 minutes
  await page.setDefaultNavigationTimeout(120000);

  /*Emulating a Wifi connection
    "/8" is included because network speed is commonly measured in bits/s
    DevTools expects throughputs in bytes/s*/
  const client = await page.target().createCDPSession();
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (downSpeed * 1024 * 1024) / 8,
    uploadThroughput: (upSpeed * 1024 * 1024) / 8,
    latency: 0,
  });

  // waits until the page is fully loaded
  // TODO: handle navigationTimeouts
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  // Returning info
  const results = JSON.parse(
    await page.evaluate(() => {
      return JSON.stringify(performance.timing);
    }),
  );

  return {
    url: url,
    responseStart: getTimeToFirstByte(results),
    loadEventEnd: getTimeToPageLoaded(results),
    domInteractive: 0,
    firstPaint: 0,
    firstContentfulPaint: 0, //still working on adding these metrics
    firstMeaningfulPaint: 0,
    custom: {
      ampJavascriptSize: [],
      installStyles: [0, 0],
      visible: 0,
      onFirstVisible: 0,
      makeBodyVisible: 0,
      windowLoadEvent: 0,
      firstViewportReady: 0,
    },
  };
};
