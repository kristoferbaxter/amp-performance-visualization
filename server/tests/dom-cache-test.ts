import test from 'ava';
import {DOMCache} from '../cache/dom-cache'
import { VersionConfiguration } from '../configuration/test-configuration';
import { JSDOM } from 'jsdom';
import { promises as fsPromises } from 'fs';


test('documentCache correct', async t =>{
  const versions: VersionConfiguration[] = [{name:'v1', rtv:'1234'}, {name: 'v2', rtv: '4321'}];
  const docCache = new DOMCache();

  await docCache.documentCache(versions[0].rtv);

  await fsPromises.access(docCache.docCache[versions[0].rtv].location);
  
  //Satisfying Ava's requirement for atleast one assertion
  t.is(true, true);
})

test('override and get methods correct', async t => {
  const urls = ['https://amp.dev/', 'https://www.nytimes.com/'];
  const docCache = new DOMCache();
  //test JSDOM
  const dom1: JSDOM = new JSDOM("<html><body></body></html>");

  await docCache.get('v1', urls[1]);
  await fsPromises.access(docCache.docCache['v1'].location);

  await docCache.override('default', urls[0], dom1);
  t.is((await docCache.get('default', urls[0])).serialize(), dom1.serialize())
})