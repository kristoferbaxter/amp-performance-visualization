import * as fs from 'fs';
import { promisify } from 'util';
import { NetworkJSON } from './json-metrics';
import multiRunMetrics, { URLFileJSON } from './metrics-from-url-array';

const readFile = promisify(fs.readFile);
const checkFile = promisify(fs.access);
const returnFileContent: (path: string) => Promise<string> = (location: string): Promise<string> => readFile(location, 'utf8');
const checkIfFileReadable = (path: string): Promise<void | Error> => checkFile(path, fs.constants.R_OK);
const argv = require('yargs').argv;

const DEFAULT_NETWORK: NetworkJSON = {
  downSpeed: 1536,
  upSpeed: 750,
  latency: 40,
};

async function run() {
  await checkIfFileReadable(argv.urls).then(err => {
    if (err) {
      console.error(err);
      return;
    }
    return;
  });

  let parsedNetwork: NetworkJSON;

  await checkIfFileReadable(argv.network).then(err => {
    if (err) {
      parsedNetwork = DEFAULT_NETWORK;
      console.log(
        `Using default network settings: downSpeed ${parsedNetwork.downSpeed} kb/s | upSpeed ${parsedNetwork.upSpeed} kb/s | latency ${
          parsedNetwork.latency
        }`,
      );
      return;
    }
    returnFileContent(argv.network).then(networkFile => {
      parsedNetwork = JSON.parse(networkFile);
    });
    return;
  });

  // Metrics returning all -1 means the url took longer than 4 minutes to load
  // Metrics returning all -2 means the url is not AMP
  // Metrics returning all -3 means the program failed to go to the page

  returnFileContent(argv.urls)
    .then(urlsFile => {
      try {
        const parsedURLs: URLFileJSON = JSON.parse(urlsFile);
        let numRuns: number = 3;

        if (argv.runs) {
          numRuns = argv.runs;
        } else {
          console.log(`Number of Runs not specified, 3 Runs will be returned`);
        }

        multiRunMetrics(parsedURLs, parsedNetwork, numRuns).then(data => {
          fs.writeFile('server/results/amp-metrics.json', JSON.stringify(data, null, 2), err => {
            if (err) {
              throw err;
            }
            process.exit(0);
          });
        });
      } catch (e) {
        console.log('There was an exception running metrics', e);
      }
    })
    .catch(e => {
      console.log('there was an error finding your files', e);
    });
}

run();
