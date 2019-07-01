export interface Metrics {
  graphableData: TimeMetrics;
  tableData: AMPJavaScriptSizeEntry[];
}

export interface TimeMetrics {
  responseStart: number; // firstByte
  loadEventEnd: number; // pageLoad
  domInteractive: number; // interactive
  firstPaint: number;
  firstContentfulPaint: number;
  firstMeaningfulPaint: number;
  installStyles: number;
  installStylesDuration: number;
  visible: number;
  onFirstVisible: number;
  makeBodyVisible: number;
  windowLoadEvent: number;
  firstViewportReady: number;
}

export interface AMPJavaScriptSizeEntry {
  url: string;
  size: number;
}

export interface MultipleRuns {
  url: string;
  size: number;
}

export interface Results {
  device: string;
  networkSpeed: string;
  metrics: MultipleRuns[];
}

export interface PuppeteerMetrics {
  metrics: Array<{
    name: string;
    value: number;
  }>;
}

// export interface ParsedData {
//   performance: PerformanceMetrics[];
//   amp: AMPEntry[];
// }

/*export interface Metrics {
  graphableData: NumberMetrics,
  tableData: AMPJavaScriptSizeEntry[],
}

export interface NumberMetrics {
 responseStart: number;
 loadEventEnd: number;
 domInteractive: number;
 firstPaint: number;
 firstContentfulPaint: number;
 firstMeaningfulPaint: number;
 installStyles: [number, number];
 visible: number;
 onFirstVisible: number;
 makeBodyVisible: number;
 windowLoadEvent: number;
 firstViewportReady: number;
}

export interface AMPJavaScriptSizeEntry {
 url: string;
 size: number;
}

export interface ParsedData {
  graphableData:NumberMetrics[];
  tableData:AMPJavaScriptSizeEntry[];
}*/
