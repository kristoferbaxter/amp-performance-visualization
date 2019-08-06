export interface TestPass {
  device: string;
  networkSpeed: string;
  results: Results[];
}

export interface Results {
  url: string;
  performance: TimeMetrics[];
  amp: AMPEntry[];
}

export interface TimeMetrics {
  responseStart: number; // firstByte
  loadEventEnd: number; // pageLoad
  firstPaint: number;
  firstContentfulPaint: number; // use Performance.metrics
  firstMeaningfulPaint: number;
  installStyles: number;
  installStylesDuration: number;
  visible: number;
  onFirstVisible: number;
  makeBodyVisible: number;
  windowLoadEvent: number;
  firstViewportReady: number;
}

export interface AMPEntry {
  url: string;
  size: number;
}
