import { Spinner } from 'cli-spinner';
import { promisify } from 'util';
import { argv } from 'yargs';
import * as CONSTANTS from './constants';
import { info, logo, success } from './logger';

const sleep = promisify(setTimeout);

async function main(): Promise<void> {
  const urlsFile = argv.urls || CONSTANTS.DEFAULT_URLS_FILE;
  logo('\n👋 Welcome to AMP performance tool');
  info(`Running perf on URLs specified in ${urlsFile}\n`);
  const spinner = new Spinner('Fetching perf metrics from the specified URLs on base branch %s');
  Spinner.setDefaultSpinnerString(3);
  spinner.start();
  // TODO: Replace dummy timeout with actual implementation.
  await sleep(2000);
  success(`Written performance metrics for base branch in ${CONSTANTS.BASE_METRICS_URL}`);
  spinner.setSpinnerTitle('Fetching perf metrics from the specified URLs on experiment branch %s');
  await sleep(2000);
  success(`Written performance metrics for experiment branch in ${CONSTANTS.EXPERIMENT_METRICS_URL}`);
  spinner.stop(true);
}

main();
