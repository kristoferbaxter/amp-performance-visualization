import { Metrics } from './url-scraper';

// Failed page.evaluate
const EVALUATE_FAILED = 0;
// page.goto has failed
const GO_TO_FAILED = -1;

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
