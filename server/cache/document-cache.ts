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

import filenamifyUrl from 'filenamify-url';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { retrieve } from './document-retrieve';
import { ItemResponse } from './is-amp';

export class DocumentCache {
  public static CACHE_DURATION = 1 * 24 * 60 * 60 * 1000; // 1 Day in Milliseconds
  public location: string;
  private enabled: boolean | null = null;

  constructor(version: string, key: string) {
    this.location = path.resolve(__dirname, '..', ['.cache', version, key].join('-'));
  }

  /**
   * Return the encoded version of a url string.
   * @param url
   */
  public encodeUrl(url: string): string {
    return filenamifyUrl(url);
  }

  /**
   * Retrieve the requested URLs document from the File System or Network.
   * @param urls
   */
  public async get(urls: string[]): Promise<string[]> {
    const responses: string[] = [];

    for (const url of urls) {
      if (await this.cached(url)) {
        responses.push(await fsPromises.readFile(this.path(url), 'utf8'));
      } else {
        const source = await (await retrieve([url]))[0].text();
        await this.write([
          {
            url,
            source,
          },
        ]);
        responses.push(source);
      }
    }
    return responses;
  }

  public async set(url: string, source: string): Promise<void> {
    await this.write([
      {
        url,
        source,
      },
    ]);
  }

  /**
   * Attempt to enable the Cache.
   */
  public async enable(): Promise<void> {
    try {
      await fsPromises.mkdir(this.location);
      this.enabled = true;
    } catch (reason) {
      if (reason && reason.code === 'EEXIST') {
        // The folder already exists, safe to use.
        this.enabled = true;
        return;
      }

      console.log('Unable to initialize cache, falling back to network only.');
      this.enabled = false;
    }
  }

  /**
   * Get the Cache Path for a url.
   * @param url
   */
  private path(url: string): string {
    return path.resolve(this.location, filenamifyUrl(url));
  }

  /**
   * Determine if a URL is cached.
   * @param url
   */
  private async cached(url: string): Promise<boolean> {
    if (this.enabled) {
      try {
        const stats = await fsPromises.stat(this.path(url));
        return stats.isFile() && stats.birthtimeMs >= Date.now() - DocumentCache.CACHE_DURATION;
      } catch (reason) {}
    }

    return false;
  }

  /**
   * Write the Responses to the File System
   * @param responses
   */
  private async write(responses: ItemResponse[]): Promise<boolean> {
    if (this.enabled) {
      try {
        await Promise.all(
          responses.map(async response => {
            if (!(await this.cached(response.url))) {
              return fsPromises.writeFile(this.path(response.url), response.source, {
                flag: 'w',
                encoding: 'utf8',
              });
            }
          }),
        );
        return true;
      } catch (reason) {
        console.log('Unable to write entries to cache', reason);
      }
    }

    return false;
  }
}
