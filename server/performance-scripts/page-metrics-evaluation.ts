// ===============Metrics Methods===============
// Time Until First Byte
export const getTimeToFirstByte = (results: PerformanceTiming): number => results.responseStart - results.navigationStart;

// Time Until Fully Loaded
export const getTimeToPageLoaded = (results: PerformanceTiming): number => results.loadEventEnd - results.navigationStart;

// Time Until Interactive
export const getTimeToInteractive = (results: PerformanceTiming) => results.domInteractive - results.navigationStart;

// Time Until the First Contentful Paint
export const getTimeToFirstContentfulPaint = (results: PerformanceTiming) => results.domLoading - results.navigationStart;

