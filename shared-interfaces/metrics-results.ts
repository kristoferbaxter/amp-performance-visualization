export interface Metrics {
  graphableData: NumberMetrics;
  tableData: AMPJavaScriptSizeEntry[];
}

export interface NumberMetrics {
  responseStart: number; // firstByte
  loadEventEnd: number; // pageLoad
  domInteractive: number; // interactive
  firstPaint: number;
  firstContentfulPaint: number; // use Performance.metrics injected into webpage
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
  runs: Metrics[];
}

export interface Results {
  device: string;
  networkSpeed: string;
  metrics: MultipleRuns[];
}
