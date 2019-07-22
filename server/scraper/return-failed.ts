import { Metrics } from './url-scraper';

// Failed page.evaluate
const EVALUATE_FAILED = 0;
// The webpage loaded too slow
const SLOW_URL = -1;
// The url entered is not amp
const NOT_AMP = -2;
// page.goto has failed
const GO_TO_FAILED = -3;

export const invalidAMP = (url: string): Metrics => ({
  performanceData: {
    responseStart: NOT_AMP, // firstByte
    loadEventEnd: NOT_AMP, // pageLoad
    firstPaint: NOT_AMP,
    firstContentfulPaint: NOT_AMP, // use Performance.metrics injected into webpage
    firstMeaningfulPaint: NOT_AMP,
    installStyles: NOT_AMP,
    installStylesDuration: NOT_AMP,
    visible: NOT_AMP,
    onFirstVisible: NOT_AMP,
    makeBodyVisible: NOT_AMP,
    windowLoadEvent: NOT_AMP,
    firstViewportReady: NOT_AMP,
  },
  ampEntries: [
    {
      url,
      size: NOT_AMP,
    },
  ],
});

export const snailURL = (url: string): Metrics => ({
  performanceData: {
    responseStart: SLOW_URL, // firstByte
    loadEventEnd: SLOW_URL, // pageLoad
    firstPaint: SLOW_URL,
    firstContentfulPaint: SLOW_URL, // use Performance.metrics injected into webpage
    firstMeaningfulPaint: SLOW_URL,
    installStyles: SLOW_URL,
    installStylesDuration: SLOW_URL,
    visible: SLOW_URL,
    onFirstVisible: SLOW_URL,
    makeBodyVisible: SLOW_URL,
    windowLoadEvent: SLOW_URL,
    firstViewportReady: SLOW_URL,
  },
  ampEntries: [
    {
      url,
      size: SLOW_URL,
    },
  ],
});

export const failedPageGoTo = (url: string): Metrics => ({
  performanceData: {
    responseStart: GO_TO_FAILED, // firstByte
    loadEventEnd: GO_TO_FAILED, // pageLoad
    firstPaint: GO_TO_FAILED,
    firstContentfulPaint: GO_TO_FAILED, // use Performance.metrics injected into webpage
    firstMeaningfulPaint: GO_TO_FAILED,
    installStyles: GO_TO_FAILED,
    installStylesDuration: GO_TO_FAILED,
    visible: GO_TO_FAILED,
    onFirstVisible: GO_TO_FAILED,
    makeBodyVisible: GO_TO_FAILED,
    windowLoadEvent: GO_TO_FAILED,
    firstViewportReady: GO_TO_FAILED,
  },
  ampEntries: [
    {
      url,
      size: GO_TO_FAILED,
    },
  ],
});

export const failedPageEval = (url: string): Metrics => ({
  performanceData: {
    responseStart: EVALUATE_FAILED, // firstByte
    loadEventEnd: EVALUATE_FAILED, // pageLoad
    firstPaint: EVALUATE_FAILED,
    firstContentfulPaint: EVALUATE_FAILED, // use Performance.metrics injected into webpage
    firstMeaningfulPaint: EVALUATE_FAILED,
    installStyles: EVALUATE_FAILED,
    installStylesDuration: EVALUATE_FAILED,
    visible: EVALUATE_FAILED,
    onFirstVisible: EVALUATE_FAILED,
    makeBodyVisible: EVALUATE_FAILED,
    windowLoadEvent: EVALUATE_FAILED,
    firstViewportReady: EVALUATE_FAILED,
  },
  ampEntries: [
    {
      url,
      size: EVALUATE_FAILED,
    },
  ],
});
