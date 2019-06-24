export interface Metrics {
  url: string;
  responseStart: number; // firstByte
  loadEventEnd: number; // pageLoad
  domInteractive: number; // interactive
  firstPaint: number;
  firstContentfulPaint: number; // use Performance.metrics injected into webpage
  firstMeaningfulPaint: number;
  custom: AMPCustomMetrics;
}

export interface AMPJavaScriptSizeEntry {
  url: string;
  size: number;
}

export interface AMPCustomMetrics {
  ampJavascriptSize: AMPJavaScriptSizeEntry[];
  installStyles: [number, number];
  visible: number;
  onFirstVisible: number;
  makeBodyVisible: number;
  windowLoadEvent: number;
  firstViewportReady: number;
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
