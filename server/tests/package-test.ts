import test from 'ava';
import { getMetadata, Package, getCached } from '../package';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

test('package getMetadata', async t => {
  const contents: string = await fsPromises.readFile(path.resolve(__dirname, '..', '..', 'package.json'), 'utf8');
  const parsedContents = JSON.parse(contents) as Package;

  t.is(getCached(), null);
  t.deepEqual(await getMetadata(), parsedContents);
  t.notDeepEqual(getCached(), null);
})