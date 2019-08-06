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

import { JSDOM } from 'jsdom';
import ProgressBar from 'progress';
import { VersionConfiguration } from '../configuration/test-configuration';
import { DOMCache } from './dom-cache';

/**
 * Perform variation requested by each branch of the test and cache the results.
 * @param version
 * @param domCache
 * @param urls
 */
async function replaceVersion(version: VersionConfiguration, domCache: DOMCache, urls: string[], progressBar: ProgressBar): Promise<void> {
  for (const url of urls) {
    const defaultDOM: JSDOM = await domCache.get('default', url);
    const versionDOM: JSDOM = new JSDOM(defaultDOM.serialize());

    // Original: https://cdn.ampproject.org/v0.js
    // Replacement: https://cdn.ampproject.org/rtv/001906282130140/v0.js

    // Original Extension: https://cdn.ampproject.org/v0/amp-animation-0.1.js
    // Replacement Extension: https://cdn.ampproject.org/rtv/001906282130140/v0/amp-animation-0.1.js

    const scripts = Array.from(versionDOM.window.document.querySelectorAll('script'));
    for (const script of scripts) {
      if (script.src.startsWith('https://cdn.ampproject.org/v0/')) {
        script.src = script.src.replace('https://cdn.ampproject.org/v0/', `https://cdn.ampproject.org/v0/rtv/${version.rtv}/`);
      } else if (script.src === 'https://cdn.ampproject.org/v0.js') {
        script.src = `https://cdn.ampproject.org/rtv/${version.rtv}/v0.js`;
      }
    }

    await domCache.override(version.rtv, url, versionDOM);
    progressBar.tick();
  }
}

/**
 * Perform variation on all requested URLs for a specified version.
 * @param versions
 * @param domCache
 * @param urls
 */
export async function replace(versions: VersionConfiguration[], domCache: DOMCache, urls: string[], progressBar: ProgressBar): Promise<void> {
  for (const version of versions) {
    await replaceVersion(version, domCache, urls, progressBar);
  }
}
