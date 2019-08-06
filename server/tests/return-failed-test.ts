import test from 'ava';
import { failedPageEval, failedPageGoTo } from '../scraper/return-failed';
import { Metrics } from '../scraper/url-scraper';

const url = 'cnn.com'
  const failedGoTo: Metrics = {
    performanceData: {
      responseStart: -1, // firstByte
      loadEventEnd: -1, // pageLoad
      firstPaint: -1,
      firstContentfulPaint: -1, // use Performance.metrics injected into webpage
      firstMeaningfulPaint: -1,
      installStyles: -1,
      installStylesDuration: -1,
      visible: -1,
      onFirstVisible: -1,
      makeBodyVisible: -1,
      windowLoadEvent: -1,
      firstViewportReady: -1,
    },
    ampEntries: [
      {
        url,
        size: -1,
      },
    ],
  }

  const failedEval: Metrics = {
    performanceData: {
      responseStart: 0, // firstByte
      loadEventEnd: 0, // pageLoad
      firstPaint: 0,
      firstContentfulPaint: 0, // use Performance.metrics injected into webpage
      firstMeaningfulPaint: 0,
      installStyles: 0,
      installStylesDuration: 0,
      visible: 0,
      onFirstVisible: 0,
      makeBodyVisible: 0,
      windowLoadEvent: 0,
      firstViewportReady: 0,
    },
    ampEntries: [
      {
        url,
        size: 0,
      },
    ],
  }

test('failed return', t => {
  t.deepEqual(failedPageEval(url), failedEval);
  t.deepEqual(failedPageGoTo(url), failedGoTo);
})