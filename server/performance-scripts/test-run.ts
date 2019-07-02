import * as fs from 'fs';
import { promisify } from 'util';
import { NetworkJSON } from './json-metrics';
import multiRunMetrics, { URLFileJSON } from './metrics-from-url-array';

const readFile = promisify(fs.readFile);
const returnFileContent: (path: string) => Promise<string> = (location: string): Promise<string> => readFile(location, 'utf8');

// Metrics returning all -1 means the url took longer than 4 minutes to load
// Metrics returning all -2 means the url is not AMP
// Metrics returning all -3 means the program failed to go to the page

Promise.all([returnFileContent(process.argv[2]), returnFileContent(process.argv[3])])
  .then(([urlsFile, networkFile]) => {
    try {
      const parsedURLs: URLFileJSON = JSON.parse(urlsFile);
      const parsedNetwork: NetworkJSON = JSON.parse(networkFile);
      let numRuns: number = 3;
      if (process.argv[4]) {
        numRuns = Number.parseInt(process.argv[4]);
      } else {
        console.log('Number of Runs was not given, using default value of 3');
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
