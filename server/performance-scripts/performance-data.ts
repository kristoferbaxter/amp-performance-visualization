export default interface Statistics {
  url: string;
  responseStart: number; // firstByte
  loadEventEnd: number; // pageLoad
  domInteractive: number; // interactive
  firstPaint: number;
  firstContentfulPaint: number; // use Performance.metrics injected into webpage
  firstMeaningfulPaint: number;
  custom: AMPCustomStatistics;
}

export interface AMPJavaScriptSizeEntry {
  url: string;
  size: number;
}

export interface AMPCustomStatistics {
  ampJavascriptSize: AMPJavaScriptSizeEntry[];
  installStyles: [number, number];
  visible: number;
  onFirstVisible: number;
  makeBodyVisible: number;
  windowLoadEvent: number;
  firstViewportReady: number;
}


// Failed page.evaluate
const EVALUATE_FAILED = 0;
// The webpage loaded too slow
const SLOW_URL = -1;
// The url entered is not amp
const NOT_AMP = -2;
// page.goto has failed
const GO_TO_FAILED = -3;


export const invalidAMP = (url: string): Statistics => ({
  url,
  responseStart: NOT_AMP, // firstByte
  loadEventEnd: NOT_AMP, // pageLoad
  domInteractive: NOT_AMP, // interactive
  firstPaint: NOT_AMP,
  firstContentfulPaint: NOT_AMP, // use Performance.metrics injected into webpage
  firstMeaningfulPaint: NOT_AMP,
  custom: {
    ampJavascriptSize: [
      {
        url,
        size: NOT_AMP,
      },
    ],
    installStyles: [NOT_AMP, NOT_AMP],
    visible: NOT_AMP,
    onFirstVisible: NOT_AMP,
    makeBodyVisible: NOT_AMP,
    windowLoadEvent: NOT_AMP,
    firstViewportReady: NOT_AMP,
  },
});

export const snailURL = (url: string): Statistics => ({
  url,
  responseStart: SLOW_URL, // firstByte
  loadEventEnd: SLOW_URL, // pageLoad
  domInteractive: SLOW_URL, // interactive
  firstPaint: SLOW_URL,
  firstContentfulPaint: SLOW_URL, // use Performance.metrics injected into webpage
  firstMeaningfulPaint: SLOW_URL,
  custom: {
    ampJavascriptSize: [
      {
        url,
        size: SLOW_URL,
      },
    ],
    installStyles: [SLOW_URL, SLOW_URL],
    visible: SLOW_URL,
    onFirstVisible: SLOW_URL,
    makeBodyVisible: SLOW_URL,
    windowLoadEvent: SLOW_URL,
    firstViewportReady: SLOW_URL,
  },
});

export const failedPageGoTo = (url: string): Statistics => ({
  url,
  responseStart: GO_TO_FAILED, // firstByte
  loadEventEnd: GO_TO_FAILED, // pageLoad
  domInteractive: GO_TO_FAILED, // interactive
  firstPaint: GO_TO_FAILED,
  firstContentfulPaint: GO_TO_FAILED, // use Performance.metrics injected into webpage
  firstMeaningfulPaint: GO_TO_FAILED,
  custom: {
    ampJavascriptSize: [
      {
        url,
        size: GO_TO_FAILED,
      },
    ],
    installStyles: [GO_TO_FAILED, GO_TO_FAILED],
    visible: GO_TO_FAILED,
    onFirstVisible: GO_TO_FAILED,
    makeBodyVisible: GO_TO_FAILED,
    windowLoadEvent: GO_TO_FAILED,
    firstViewportReady: GO_TO_FAILED,
  },
});


export const failedPageEval = (url: string): Statistics => ({
  url,
  responseStart: EVALUATE_FAILED, // firstByte
  loadEventEnd: EVALUATE_FAILED, // pageLoad
  domInteractive: EVALUATE_FAILED, // interactive
  firstPaint: EVALUATE_FAILED,
  firstContentfulPaint: EVALUATE_FAILED, // use Performance.metrics injected into webpage
  firstMeaningfulPaint: EVALUATE_FAILED,
  custom: {
    ampJavascriptSize: [
      {
        url,
        size: EVALUATE_FAILED,
      },
    ],
    installStyles: [EVALUATE_FAILED, EVALUATE_FAILED],
    visible: EVALUATE_FAILED,
    onFirstVisible: EVALUATE_FAILED,
    makeBodyVisible: EVALUATE_FAILED,
    windowLoadEvent: EVALUATE_FAILED,
    firstViewportReady: EVALUATE_FAILED,
  },
});

