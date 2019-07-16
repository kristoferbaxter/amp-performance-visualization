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

import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { PerformancePassResults } from '../shared/interfaces';

/**
 * Write results to the file system (name=${version.rtv}-results.json)
 * @param results
 * @param name
 */
export async function report(results: PerformancePassResults, name: string): Promise<string> {
  const location = path.resolve(__dirname, '..', 'results', `${name}.json`);

  await fsPromises.writeFile(location, JSON.stringify(results, undefined, 2), {
    flag: 'wx',
    encoding: 'utf8',
  });
  return location;
}
