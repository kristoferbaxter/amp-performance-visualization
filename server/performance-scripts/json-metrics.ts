/**
 * @fileoverview Description of this file.
 */
import { launch } from 'puppeteer';
import { getTimeToFirstByte, getTimeToPageLoaded } from './page-metrics-evaluation';
import Statistics, { notAMP, snailURL, failedPageGoTo } from './performance-data';
import isAMP from './is-AMP';


//Temporary output. Only to show new interface, not the actual output
const TEMP_OUTPUT = 0;


// networkidle0 means that there are no more than 0 network connections for atleast 500 milliseconds
const NAVIGATION_COMPLETE = 'networkidle0';

export default async (url: string, downSpeed: number, upSpeed: number, lat: number): Promise<Statistics> => {
  if (!(await isAMP(url))) {
    return notAMP(url);
  }

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
    downloadThroughput: (downSpeed * 1024) / 8,
    uploadThroughput: (upSpeed * 1024) / 8,
    latency: lat,
  });

  // waits until the page is fully loaded
  // TODO: handle navigationTimeouts
  try {
    await page.goto(url, {
      timeout: 0, //disables navigation timeout
      waitUntil: NAVIGATION_COMPLETE,
    });
  } catch (e) {
    return failedPageGoTo(url);
  }

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
    domInteractive: TEMP_OUTPUT,
    firstPaint: TEMP_OUTPUT,
    firstContentfulPaint: TEMP_OUTPUT, //still working on adding these metrics
    firstMeaningfulPaint: TEMP_OUTPUT,
    custom: {
      ampJavascriptSize: [],
      installStyles: [TEMP_OUTPUT, TEMP_OUTPUT],
      visible: TEMP_OUTPUT,
      onFirstVisible: TEMP_OUTPUT,
      makeBodyVisible: TEMP_OUTPUT,
      windowLoadEvent: TEMP_OUTPUT,
      firstViewportReady: TEMP_OUTPUT,
    },
  };
};
