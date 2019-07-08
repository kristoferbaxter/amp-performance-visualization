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

export interface PaintTiming {
  firstPaint: number;
  firstContentfulPaint: number;
  firstMeaningfulPaint: number;
}

/**
 * Use Puppeteer to retrieve paint timing from the current Page.
 * @param page
 */
export function getPaintTiming(page: Page): Promise<PaintTiming> {
  return page.evaluate(_ => {
    // Puppeteeer will execute this function inside the document.
    function format(entry: PerformanceResourceTiming | undefined): number | null {
      return entry ? Math.round(entry.startTime * 1000) / 1000 : null;
    }

    const paintEntries = performance.getEntriesByType('paint') as PerformanceResourceTiming[];
    const firstPaint: PaintTiming['firstPaint'] = format(paintEntries.find(entry => entry.name === 'first-paint')) || -1;
    const firstContentfulPaint: PaintTiming['firstContentfulPaint'] =
      format(paintEntries.find(entry => entry.name === 'first-contentful-paint')) || -1;

    return {
      firstPaint,
      firstContentfulPaint,
      firstMeaningfulPaint: 0, // TODO: UNDEFINED SO FAR
    };
  });
}
