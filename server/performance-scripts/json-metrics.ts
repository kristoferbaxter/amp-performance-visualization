/**
 * @fileoverview Description of this file.
 */
import { launch } from 'puppeteer';
import isAMP from './is-AMP';
import { getTimeToFirstByte, getTimeToPageLoaded } from './page-metrics-evaluation';
import Statistics, { failedPageGoTo, invalidAMP, ResultsCalculator, snailURL } from './performance-data';

// Temporary output. Only to show new interface, not the actual output
const TEMP_OUTPUT = 0;
// const for line 58
const NAV_TIMEOUT = 120000;
// networkidle0 means that there are no more than 0 network connections for atleast 500 milliseconds
const NAVIGATION_COMPLETE = 'networkidle0';

const getMetrics: ResultsCalculator = async (url: string, downSpeed: number, upSpeed: number, latency: number): Promise<Statistics> => {
  if (!(await isAMP(url))) {
    return invalidAMP(url);
  }

  const browser = await launch();
  const page = await browser.newPage();
  // Sets the navigation timeout to 2 minutes
  await page.setDefaultNavigationTimeout(NAV_TIMEOUT);

  /*
    Emulating a Wifi connection
    "/8" is included because network speed is commonly measured in bits/s
    DevTools expects throughputs in bytes/s
  */
  const client = await page.target().createCDPSession();
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (downSpeed * 1024) / 8,
    uploadThroughput: (upSpeed * 1024) / 8,
    latency,
  });

  // waits until the page is fully loaded
  try {
    await page.goto(url, {
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
    url,
    responseStart: getTimeToFirstByte(results),
    loadEventEnd: getTimeToPageLoaded(results),
    domInteractive: TEMP_OUTPUT,
    firstPaint: TEMP_OUTPUT,
    firstContentfulPaint: TEMP_OUTPUT, // still working on adding these metrics
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

const getResults = async (url: string, downSpeed: number, upSpeed: number, lat: number) => {
  const slowURLReturn = snailURL(url);
  const slowURL = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        slowURLReturn,
      });
    }, NAV_TIMEOUT - 100);
  });

  const pageMetrics = getMetrics(url, downSpeed, upSpeed, lat);

  return await Promise.race([slowURL, pageMetrics]);
};

export default getResults;
