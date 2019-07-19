export interface PuppeteerMetrics {
  metrics: Array<{
    name: string;
    value: number;
  }>;
}

export const enum PuppeteerMetricsList {
  Timestamp = 0,
  AudioHandlers,
  Documents,
  Frames,
  JSEventListeners,
  LayoutObjects,
  MediaKeySessions,
  MediaKeys,
  Nodes,
  Resources,  
  ScriptPromises,
  PausableObjects,
  V8PerContextDatas,
  WorkerGlobalScopes,
  UACSSResources,  
  LayoutCount,  
  RecalcStyleCount,
  LayoutDuration,
  RecalcStyleDuration,
  ScriptDuration,
  TaskDuration, 
  JSHeapUsedSize,
  JSHeapTotalSize,
  FirstMeaningfulPaint,
  DomContentLoaded,
  NavigationStart,
}