import { Page } from 'puppeteer';

export interface AMPMarkers {
  installStyles: number;
  installStylesDuration: number;
  onFirstVisible: number;
  makeBodyVisible: number;
  windowLoadEvent: number;
  firstViewportReady: number;
  visible: number;
}

export function getAMPMarkers(page: Page): Promise<AMPMarkers> {
  return page.evaluate(_ => {
    const marks = performance.getEntriesByType('mark') as PerformanceMark[];
    function retrieveMarker(name: string): number {
      const mark = marks.find(entry => entry.name === name);
      return mark ? Math.round(mark.startTime) : 0;
    }

    return {
      installStyles: retrieveMarker('is'),
      installStylesDuration: Math.round(((retrieveMarker('e_is') - retrieveMarker('is')) * 1000) / 1000),
      onFirstVisible: retrieveMarker('ofv'),
      makeBodyVisible: retrieveMarker('mbv'),
      windowLoadEvent: retrieveMarker('ol'),
      firstViewportReady: retrieveMarker('pc'),
      visible: retrieveMarker('visible'),
    };
  });
}
