import test from 'ava';
import {DOMCache} from '../cache/dom-cache'
import { VersionConfiguration } from '../configuration/test-configuration';
import { getMetadata } from '../package';
import { LRUMap } from 'lru_map';
import { JSDOM } from 'jsdom';
import { DocumentCache } from '../cache/document-cache';
import { retrieve } from '../cache/document-retrieve';

type DOMMap = LRUMap<string, JSDOM>;
  class DOMTestCache {
    public domCaches: {
      [key: string]: DOMMap;
    } = {};
    public documentCaches: {
      [key: string]: DocumentCache;
    } = {};
  }

test('documentCache correct', async t =>{
  const versions: VersionConfiguration[] = [{name:'v1', rtv:'1234'}, {name: 'v2', rtv: '4321'}];
  const docCache = new DOMCache();
  const docCacheExpected = new DOMTestCache();

  docCacheExpected.documentCaches = {[versions[0].rtv]: new DocumentCache((await getMetadata()).version, versions[0].rtv)};
  await docCacheExpected.documentCaches[versions[0].rtv].enable();

  t.deepEqual(await docCache.documentCache(versions[0].rtv), docCacheExpected.documentCaches[versions[0].rtv]);
})

test('override and get methods correct', async t => {
  const urls = ['https://amp.dev/'];
  const docCache = new DOMCache();
  //test JSDOM
  const dom: JSDOM = new JSDOM("<html><body></body></html>");
  console.log('after source')
  await docCache.override('default', urls[0], dom);
  t.is(
    (await docCache.get('default', urls[0])).serialize(), 
    dom.serialize()
  )
})