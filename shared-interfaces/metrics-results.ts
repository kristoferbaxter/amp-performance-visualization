export interface TestPass {
  device: string;
  networkSpeed: string;
  metrics: Results[];
}

export interface Results {
  url: string;
  performance: PerformanceMetrics[];
  amp: AMPEntry[];
}

export interface PerformanceMetrics {
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

export interface AMPEntry {
  url: string;
  size: number;
}

export interface ParsedData {
  performance: PerformanceMetrics[];
  amp: AMPEntry[];
}

/*export interface Results {
  device: string;
  networkSpeed: string;
  metrics: MultipleRuns[];
}

export interface MultipleRuns {
  url: string;
  runs: Metrics[];
}

export interface Metrics {
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
