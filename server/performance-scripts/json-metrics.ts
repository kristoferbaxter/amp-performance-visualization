/**
 * @fileoverview Description of this file.
 */
import { launch } from 'puppeteer';
import { getTimeToFirstByte, getTimeToPageLoaded } from './page-metrics-evaluation';

export interface PagePerformance {
  url: string;
  firstByte: number;
  pageLoad: number;
}

//networkidle0 means that there are no more than 0 network connections for atleast 500 milliseconds
const NAVIGATION_COMPLETE = 'networkidle0';

export default async (url: string, downSpeed: number, upSpeed: number, lat: number): Promise<PagePerformance> => {
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
  try {
    await page.goto(url, {
        timeout: 0, //disables navigation timeout
        waitUntil: NAVIGATION_COMPLETE
    })
} catch (e) {
   return {
       url: url,
       firstByte: -1,
       pageLoad: -1,
   }
}

  // Returning info
  const results = JSON.parse(
    await page.evaluate(() => {
      return JSON.stringify(performance.timing);
    }),
  );

  return {
    url,
    firstByte: getTimeToFirstByte(results),
    pageLoad: getTimeToPageLoaded(results),
  };
};
