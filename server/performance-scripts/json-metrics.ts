/**
 * @fileoverview Description of this file.
 */
import { launch } from 'puppeteer';
import { getTimeToFirstByte, getTimeToPageLoaded } from './page-metrics-evaluation';
import isAMP from './is-AMP';

export interface PagePerformance {
  url: string;
  firstByte: number;
  pageLoad: number;
}

//const for line 58
const NAV_TIMEOUT = 120000;
//URL provided is not AMP
const NOT_AMP = -2;

const getMetrics = async (url: string, downSpeed: number, upSpeed: number, lat: number): Promise<PagePerformance> => {
  
  if(!(await isAMP(url))) {
    return {
        url,
        firstByte: NOT_AMP,
        pageLoad: NOT_AMP,
    }
}
  const browser = await launch();
  const page = await browser.newPage();
  

  /*Emulating a Wifi connection
    "/8" is included because network speed is commonly measured in bits/s
    DevTools expects throughputs in bytes/s*/
  const client = await page.target().createCDPSession();
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (downSpeed * 1024) / 8,
    uploadThroughput: (upSpeed * 1024) / 8,
    latency: lat,
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
    url,
    firstByte: getTimeToFirstByte(results),
    pageLoad: getTimeToPageLoaded(results),
  };
};

const getResults = async (webpage: string, downSpeed: number, upSpeed: number, lat: number) => {
  const slowURL = new Promise (resolve => {
      setTimeout(() => {
          resolve({
              url: webpage,
              firstByte: -1,
              pageLoad: -1,
          })
      },NAV_TIMEOUT-100)
  })

  const pageMetrics = getMetrics(webpage, downSpeed, upSpeed, lat);

  return await Promise.race([
      slowURL,
      pageMetrics
  ]);
}

export default getResults;