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

import getPort from 'get-port';
const polka = require('polka');
const sirv = require('sirv');
const compression = require('compression')();

type PolkaType = Function;
interface PolkaInfo {
  polka: PolkaType;
  port: number;
}

export class Polka {
  private polkas: {
    [key: string]: null | PolkaInfo;
  } = {};

  /**
   * Ensure each type of test arm has it's own Polka instance and port on localhost.
   * @param type
   * @param hostLocation
   */
  public async get(type: string, hostLocation: string): Promise<PolkaInfo> {
    if (!this.polkas[type]) {
      const port: number = await getPort({ port: 3001 });
      this.polkas[type] = {
        polka: polka()
          .use(
            compression,
            sirv(hostLocation, {
              maxAge: 100,
              immutable: true,
            }),
          )
          .listen(port),
        port,
      };
    }

    return this.polkas[type] as PolkaInfo;
  }

  get polka() {
    return this.polkas;
  }
}
