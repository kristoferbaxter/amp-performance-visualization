/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

/**
 * Use Puppeteer to retrieve AMP Custom Markers from the current page.
 * @param page
 */
export function getAMPMarkers(page: Page): Promise<AMPMarkers> {
  return page.evaluate(_ => {
    // Puppeteeer will execute this function inside the document.
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
