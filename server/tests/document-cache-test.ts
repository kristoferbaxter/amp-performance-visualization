import test from 'ava';
import {DocumentCache} from '../cache/document-cache';
import { retrieve } from '../cache/document-retrieve';
import filenamifyUrl from 'filenamify-url'


test('Correct Resource returned from FS', async t => {
  const cache = new DocumentCache('version', 'key');
  const urls: string[] = ['https://www.cnn.com/'];
  const source = await (await retrieve(urls))[0].text();

  await cache.set(urls[0], source);
  const returned = await cache.get(urls);
  t.is(typeof returned, 'object');
  t.is(returned[0], source);
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