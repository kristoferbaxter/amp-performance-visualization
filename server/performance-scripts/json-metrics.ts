import { launch } from 'puppeteer';
import generate from './generate-statistics';
import isAMP from './is-AMP';
import Statistics, { failedPageEval, failedPageGoTo, invalidAMP, ResultsCalculator, snailURL } from './performance-data';

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
  let statistics: Statistics = failedPageEval(url);

  // Returning info
  try {
    statistics = await generate(page);
  } catch (e) {
    console.log(e);
    return failedPageEval(url);
  } finally {
    await browser.close();
  }

  return statistics;
};

const getResults: ResultsCalculator = async (url: string, downSpeed: number, upSpeed: number, lat: number) => {
  const pageMetrics = getMetrics(url, downSpeed, upSpeed, lat);
  const slowURL: Promise<Statistics> = new Promise(resolve => {
    setTimeout(() => {
      resolve(snailURL(url));
    }, NAV_TIMEOUT - 100);
  });

  return await Promise.race([slowURL, pageMetrics]);
};

export default getResults;
