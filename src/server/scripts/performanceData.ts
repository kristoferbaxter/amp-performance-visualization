export default interface Statistics {
  url: string,
  responseStart: number, //firstByte
  loadEventEnd: number, //pageLoad
  domInteractive: number, //interactive
  firstContentfulPaint: number, //use Performance.metrics injected into webpage
  custom: AMPCustomStatistics
}

export interface AMPCustomStatistics {
  ampJavascriptSize: [{
    url: string,
    size: number
  }]
  installStyles: [number, number],
  visible: number,
  onFirstVisible: number,
  makeBodyVisible: number,
  windowLoadEvent: number,
  firstViewportReady: number
}


//The url entered is not amp
const NOT_AMP = -2;
//The webpage loaded too slow
const SLOW_URL = -1;
//page.goto has failed
const GO_TO_FAILED = -3;

export const notAMP = (url: string): Statistics => ({
  url,
  responseStart: NOT_AMP, //firstByte
  loadEventEnd: NOT_AMP, //pageLoad
  domInteractive: NOT_AMP, //interactive
  firstContentfulPaint: NOT_AMP, //use Performance.metrics injected into webpage
  custom: {
    ampJavascriptSize:[ {
      url,
      size: NOT_AMP
    }],
    installStyles: [NOT_AMP, NOT_AMP],
    visible: NOT_AMP,
    onFirstVisible: NOT_AMP,
    makeBodyVisible: NOT_AMP,
    windowLoadEvent: NOT_AMP,
    firstViewportReady: NOT_AMP
  },
});

export const snailURL = (url: string): Statistics => ({
  url,
  responseStart: SLOW_URL, //firstByte
  loadEventEnd: SLOW_URL, //pageLoad
  domInteractive: SLOW_URL, //interactive
  firstContentfulPaint: SLOW_URL, //use Performance.metrics injected into webpage
  custom: {
    ampJavascriptSize:[{
      url,
      size: SLOW_URL
    }],
    installStyles: [SLOW_URL, SLOW_URL],
    visible: SLOW_URL,
    onFirstVisible: SLOW_URL,
    makeBodyVisible: SLOW_URL,
    windowLoadEvent: SLOW_URL,
    firstViewportReady: SLOW_URL
  }
})

export const failedPageGoTo = (url: string): Statistics => ({
  url,
  responseStart: GO_TO_FAILED, //firstByte
  loadEventEnd: GO_TO_FAILED, //pageLoad
  domInteractive: GO_TO_FAILED, //interactive
  firstContentfulPaint: GO_TO_FAILED, //use Performance.metrics injected into webpage
  custom: {
    ampJavascriptSize: [{
      url,
      size: GO_TO_FAILED
    }],
    installStyles: [GO_TO_FAILED, GO_TO_FAILED],
    visible: GO_TO_FAILED,
    onFirstVisible: GO_TO_FAILED,
    makeBodyVisible: GO_TO_FAILED,
    windowLoadEvent: GO_TO_FAILED,
    firstViewportReady: GO_TO_FAILED
  } 
})

