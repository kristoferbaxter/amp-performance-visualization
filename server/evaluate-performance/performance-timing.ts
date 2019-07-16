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

/**
 * Use Puppeteer to retrieve performance timing from the current Page.
 * @param page
 */
export function getPerformanceTiming(page: Page): Promise<PerformanceTiming> {
  return page.evaluate(_ => {
    return JSON.parse(JSON.stringify(performance.timing));
  });
}
