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

export class Configuration<T> {
  private location: string;
  private cached: T;

  constructor(location: string) {
    this.location = location;
  }

  /**
   * Retrieve the configuration from the File System
   */
  public async get(): Promise<T | null> {
    try {
      const contents: string = await fsPromises.readFile(path.resolve(this.location), 'utf8');
      this.cached = JSON.parse(contents) as T;
      return this.cached;
    } catch (reason) {
      console.log(`Could not load requested Configuration at ${this.location}`, reason);
    }

    return null;
  }
}
