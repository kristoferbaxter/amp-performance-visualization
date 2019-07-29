import test from 'ava';
import fetch, { RequestInit, Response } from 'node-fetch';
import { retrieve } from '../cache/document-retrieve';

test('Source retrieved via Network', async t => {
  const urls: Array<string> = ['https://amp.dev'];
  const OPTIONS: RequestInit = {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Mobile Safari/537.36',
    },
    compress: true,
    follow: 2,
    timeout: 20 * 1000,
  };
  const sources: Array<string> = [];
  const urlSources: Array<string> = [];

  
  
  (await retrieve(urls)).forEach(async (response: Response): Promise<void> => {
    const awaitedSource: string = await response.text();
    sources.push(awaitedSource);
  });

  const responseArray: Array<Response> = (await Promise.all(urls.map(url => fetch(url, OPTIONS))));

  for (const response of responseArray) {
    const awaitedExpectedSource: string = await response.text();
    urlSources.push(awaitedExpectedSource);
  }

  sources.forEach((source,index)=> {
    t.is(source, urlSources[index]);
  });

});