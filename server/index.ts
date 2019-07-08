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

import mri from 'mri';
import ProgressBar from 'progress';
import { PerformancePassResults } from '../shared/interfaces';
import { getNetworkConfiguration, getNetworkPresets, NamedNetworkPreset, NetworkConfiguration } from './configuration/network-configuration';
import { getTestConfiguration, getVersionConfiguration, TestConfiguration } from './configuration/test-configuration';
import { getURLConfiguration, URLConfiguration } from './configuration/url-configuration';
import { isAMPDocument } from './document';
import { capture } from './document-performance';
import { replace } from './document-replacement';
import { DOMCache } from './dom-cache';
import { report } from './report-results';

(async function() {
  const args: mri.Argv = mri(process.argv.slice(2), {
    default: {
      urls: 'config/urls.json',
      network: 'config/network.json',
      test: 'config/test.json',
    },
  });

  try {
    const URLConfiguration: URLConfiguration | null = await getURLConfiguration(args);
    const NetworkConfiguration: NetworkConfiguration | null = await getNetworkConfiguration(args);
    const TestConfiguration: TestConfiguration | null = await getTestConfiguration(args);

    if (URLConfiguration === null || NetworkConfiguration === null || TestConfiguration === null) {
      console.log('Invalid path specified in CLI arguments, try the following pattern: `perf {urls.json} {network.json} {test.json}`');
      return;
    }

    // Populate the DOMCache and Filesystem Cache with the requested URLs.
    const domCache = new DOMCache();
    const validURLs: string[] = [];
    const CacheProgressBar = new ProgressBar('Caching Documents  [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: URLConfiguration.urls.length,
    });
    for (const url of URLConfiguration.urls) {
      const dom = await domCache.get('default', url);
      if (isAMPDocument(dom)) {
        validURLs.push(url);
      }
      CacheProgressBar.tick();
    }

    // Replace the contents of the original documents with the control and experiment variations.
    const versionConfiguration = getVersionConfiguration(TestConfiguration);
    const ReplaceProgressBar = new ProgressBar('Storing Alternates [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: validURLs.length * versionConfiguration.length,
    });
    await Promise.all(replace(versionConfiguration, domCache, validURLs, ReplaceProgressBar));

    // After we have the variations, we need to host these documents and
    // instruct Puppeteer to collect data on the different cells.
    const networks: NamedNetworkPreset[] = getNetworkPresets(NetworkConfiguration);
    const PerformanceProgressBar = new ProgressBar('Analyzing Results  [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: validURLs.length * versionConfiguration.length,
    });
    const reports: string[] = [];
    for (const version of versionConfiguration) {
      const results: PerformancePassResults = {
        device: 'Device Name',
        networkSpeed: networks[0].name,
        results: await capture(version, networks[0], TestConfiguration, domCache, validURLs, PerformanceProgressBar),
      };
      reports.push(await report(results, version.rtv));
    }
    console.log('Reports:', JSON.stringify(reports));
  } catch (reason) {
    console.log('Error Parsing Configuration File(s):', reason);
  }

  process.exit(0);
})();
