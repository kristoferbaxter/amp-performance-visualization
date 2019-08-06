import test from 'ava';
import {DocumentCache} from '../cache/document-cache';
import fetch from 'node-fetch';
import filenamifyUrl from 'filenamify-url'
import { retrieve } from '../cache/document-retrieve';


test('Correct Resource returned from FS', async t => {
  const cache = new DocumentCache('version', 'key');
  const urls: string[] = ['https://www.cnn.com/', 'https://www.nytimes.com/'];
  const response1 = await (await fetch(urls[0])).text();
  const response2 = await (await retrieve(urls))[1].text();

  await cache.set(urls[0], response1);
  const returned = await cache.get(urls);
  t.is(typeof returned, 'object');
  t.is(returned[0], response1);
  t.is(returned[1], response2);
});

test('Cache enabled', async t => {
  const cache = new DocumentCache('version', 'key');

  t.is(cache.getEnabled(), null);

  await cache.enable();
  t.is(cache.getEnabled(), true);

  await cache.enable();
  t.is(cache.getEnabled(), true);
})

test('URL Encoded', t => {
  const cache = new DocumentCache('version', 'key');
  const url = 'https://www.cnn.com/';
  const fileNameActual = cache.encodeUrl(url);

  t.is(fileNameActual, filenamifyUrl(url)); 
})