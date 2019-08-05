import test from 'ava';
import { promises as fsPromises } from 'fs';
import { VersionConfiguration } from '../configuration/test-configuration';
import { TestPass } from '../../shared/interfaces';

test('File written', async t => {
  const report: TestPass = {
    device: 'iPhone XII',
    networkSpeed: 'SuperFast',
    results: []
  }
  const versions: VersionConfiguration[] = [{name:'v1', rtv:'1234'}, {name: 'v2', rtv: '4321'}];

  await fsPromises.writeFile(`server/results/${versions[0].rtv}.json`, JSON.stringify(report, null, 2));

  await fsPromises.access(`server/results/${versions[0].rtv}.json`);

  //Satisfying Ava's requirement for atleast one assertion
  t.is(true, true);
})