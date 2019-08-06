import test from 'ava';
import { JSDOM } from 'jsdom';
import  fetch from 'node-fetch';
import { isAMPDocument } from '../scraper/is-amp';

test('Document tested for AMP correctly', async t => {
  const urls = ['https://amp.dev/', 'https://www.reddit.com/'];
  const ampDevMarkup = await (await fetch(urls[0])).text();
  const redditMarkup = await (await fetch(urls[1])).text();
  const ampDevDOM: JSDOM = new JSDOM(ampDevMarkup);
  const dummyDom: JSDOM = new JSDOM();
  const redditDom: JSDOM = new JSDOM(redditMarkup);
  
  t.is(isAMPDocument(ampDevDOM), true);
  t.is(isAMPDocument(dummyDom), false);
  t.is(isAMPDocument(redditDom), false);
})