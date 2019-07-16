export interface PerformancePassResults {
  device: string;
  networkSpeed: string;
  results: URLPerformanceMetrics[];
}

export interface URLPerformanceMetrics {
  url: string;
  performance: PerformanceMarkers[];
  amp: AMPResourceWeight[];
}

export interface PerformanceMarkers {
  responseStart: number;
  loadEventEnd: number;
  domInteractive: number;
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

export interface AMPResourceWeight {
  url: string;
  size: number;
}
