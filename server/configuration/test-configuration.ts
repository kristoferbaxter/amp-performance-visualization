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

import { Argv } from 'mri';
import { Configuration } from './configuration';

export interface TestConfiguration {
  [key: string]: string | number;
  control: string;
  experiment: string;
  executions: number;
  concurrency: number;
}

export interface VersionConfiguration {
  name: string;
  rtv: string;
}

let cachedVersionConfiguration: VersionConfiguration[] | null = null;

/**
 * Retrieve the Test Configuration
 * @param args
 */
export async function getTestConfiguration(args: Argv): Promise<TestConfiguration | null> {
  return await new Configuration<TestConfiguration>(args.test).get();
}

/**
 * Retrieve the Version Configuration from Test Configuration
 * @param TestConfiguration
 */
export function getVersionConfiguration(TestConfiguration: TestConfiguration): VersionConfiguration[] {
  if (cachedVersionConfiguration !== null) {
    return cachedVersionConfiguration;
  }

  return (cachedVersionConfiguration = Object.keys(TestConfiguration)
    .map(key => {
      if (key !== 'executions' && key !== 'concurrency') {
        return {
          name: key,
          rtv: TestConfiguration[key],
        };
      }

      return null;
    })
    .filter(Boolean) as VersionConfiguration[]);
}
