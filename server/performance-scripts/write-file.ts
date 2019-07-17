import { promises as fsPromises } from 'fs';
import { TestPass } from '../../shared-interfaces/metrics-results';
import { VersionConfiguration } from '../configuration/test-configuration';

export async function writeFile(report: TestPass, version: VersionConfiguration): Promise<void> {
  await fsPromises.writeFile(`server/results/${version.rtv}.json`, JSON.stringify(report, null, 2));
}
