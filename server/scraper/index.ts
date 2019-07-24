import ProgressBar from 'progress';
import { TestPass } from '../../shared/interfaces';
import { replace } from '../cache/document-replacement';
import { DOMCache } from '../cache/dom-cache';
import { isAMPDocument } from './is-amp';
import { getNetworkConfiguration, getNetworkPresets, NamedNetworkPreset, NetworkConfiguration } from '../configuration/network-configuration';
import { getTestConfiguration, getVersionConfiguration, TestConfiguration } from '../configuration/test-configuration';
import { getURLConfiguration, URLConfiguration } from '../configuration/url-configuration';
import multiRunMetrics from './metrics-from-url-array';
import { writeFile } from './write-file';

const argv = require('yargs').default({
  urls: './config/urls.json',
  network: './config/network.json',
  test: './config/test.json',
  runs: 3,
}).argv;

async function run() {
  try {
    const URLConfiguration: URLConfiguration | null = await getURLConfiguration(argv.urls);
    const NetworkConfiguration: NetworkConfiguration | null = await getNetworkConfiguration(argv.network);
    const TestConfiguration: TestConfiguration | null = await getTestConfiguration(argv.test);
    if (URLConfiguration === null || NetworkConfiguration === null || TestConfiguration === null) {
      console.log('Invalid path specified in CLI arguments, try the following pattern: `perf {urls.json} {network.json} {test.json} {numberOfRuns}`');
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
    await replace(versionConfiguration, domCache, validURLs, ReplaceProgressBar);

    // Metrics returning all -1 means the url took longer than 4 minutes to load
    // Metrics returning all -2 means the url is not AMP
    // Metrics returning all -3 means the program failed to go to the page
    const networks: NamedNetworkPreset[] = getNetworkPresets(NetworkConfiguration);
    const PerformanceProgressBar = new ProgressBar('Analyzing Results  [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: validURLs.length * versionConfiguration.length * TestConfiguration.executions,
    });

    //const reports: TestPass[] = [];
    //let index: number = 0;

    for (const version of versionConfiguration) {
      const result: TestPass = await multiRunMetrics(version, TestConfiguration, networks[0], domCache, validURLs, PerformanceProgressBar);
      // reports.push(result);
      await writeFile(result, version);
    }
    process.exit(0);
  } catch (reason) {
    console.log('Error Parsing Configuration File(s):', reason);
  }
}

run();
