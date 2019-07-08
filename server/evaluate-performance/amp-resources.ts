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
import { AMPResourceWeight } from '../../shared/interfaces';

/**
 * Use Puppeteer to retrieve the AMP Resource Weight from the current page.
 * @param page
 */
export function getResources(page: Page): Promise<AMPResourceWeight[]> {
  return page.evaluate(
    (): AMPResourceWeight[] => {
      // Puppeteeer will execute this function inside the document.

      // Resource entries filtered for those starting with the AMP domain returns all AMP related resources.
      return (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
        .filter(item => item.name.startsWith('https://cdn.ampproject.org/'))
        .map(item => ({
          url: item.name,
          size: item.transferSize,
        }));
    },
  );
}
