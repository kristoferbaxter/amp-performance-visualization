import test from 'ava';
import puppeteer from 'puppeteer';
import { getAMPMarkers, AMPMarkers } from '../scrape-metrics/amp-markers';

test('Returned AMP Markers', async t => {
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

  const ampMarkers: AMPMarkers = await getAMPMarkers(page)
  
  const ampMarkersExpected: AMPMarkers = await page.evaluate(_ => {
    const marks = performance.getEntriesByType('mark') as PerformanceMark[];
    function retrieveMarker(name: string): number {
      const mark = marks.find(entry => entry.name === name);
      return mark ? Math.round(mark.startTime) : 0;
    }

    return {
      installStyles: retrieveMarker('is'),
      installStylesDuration: Math.round(((retrieveMarker('e_is') - retrieveMarker('is')) * 1000) / 1000),
      onFirstVisible: retrieveMarker('ofv'),
      makeBodyVisible: retrieveMarker('mbv'),
      windowLoadEvent: retrieveMarker('ol'),
      firstViewportReady: retrieveMarker('pc'),
      visible: retrieveMarker('visible'),
    }
  });

  

  t.deepEqual(ampMarkers, ampMarkersExpected);
  })