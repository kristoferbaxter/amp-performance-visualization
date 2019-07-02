import puppeteer from 'puppeteer';
import { AMPEntry, PuppeteerMetrics, TimeMetrics } from '../../shared-interfaces/metrics-results';
import generate from './generate-statistics';
import isAMP from './is-AMP';
import { failedPageEval, failedPageGoTo, invalidAMP, snailURL } from './performance-data';

export interface Metrics {
  graphableData: TimeMetrics;
  tableData: AMPEntry[];
}

export interface NetworkJSON {
  downSpeed: number;
  upSpeed: number;
  latency: number;
}

type ResultsCalculator = (url: string, network: NetworkJSON) => Promise<Metrics>;

const NAV_TIMEOUT = 240000;
// networkidle0 means that there are no more than 0 network connections for atleast 500 milliseconds
const NAVIGATION_COMPLETE = 'networkidle0';

const getMetrics: ResultsCalculator = async (url: string, network: NetworkJSON): Promise<Metrics> => {
  if (!(await isAMP(url))) {
    return invalidAMP(url);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Sets the navigation timeout to 2 minutes
  await page.setDefaultNavigationTimeout(NAV_TIMEOUT);

  /*
    Emulating a Wifi connection
    "/8" is included because network speed is commonly measured in bits/s
    DevTools expects throughputs in bytes/s
  */
  const client = await page.target().createCDPSession();
  await client.send('Performance.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (network.downSpeed * 1024) / 8,
    uploadThroughput: (network.upSpeed * 1024) / 8,
    latency: network.latency,
  });

  // waits until the page is fully loaded
  try {
    await page.goto(url, {
      waitUntil: NAVIGATION_COMPLETE,
    });
  } catch (e) {
    return failedPageGoTo(url);
  }

  const customMetrics = (await client.send('Performance.getMetrics')) as PuppeteerMetrics;

  // Returning info
  let statistics: Metrics = failedPageEval(url);

  // Returning info
  try {
    statistics = await generate(page, customMetrics);
  } catch (e) {
    console.log(e);
    return failedPageEval(url);
  } finally {
    await browser.close();
  }

  return statistics;
};

const getResults: ResultsCalculator = async (url: string, network: NetworkJSON) => {
  const pageMetrics = getMetrics(url, network);
  const slowURL: Promise<Metrics> = new Promise(resolve => {
    setTimeout(() => {
      resolve(snailURL(url));
    }, NAV_TIMEOUT - 100);
  });

  return await Promise.race([slowURL, pageMetrics]);
};

export default getResults;
