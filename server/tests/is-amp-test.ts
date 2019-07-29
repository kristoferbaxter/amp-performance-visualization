import test from 'ava';
import { JSDOM } from 'jsdom';
import { retrieve } from '../cache/document-retrieve';
import { isAMPDocument } from '../scraper/is-amp';

test('Document tested for AMP correctly', async t => {
  const url = ['https://amp.dev/'];
  const urlSource = await (await retrieve(url))[0].text();
  const nonAMPSource = await (await retrieve(['https://www.reddit.com/']))[0].text();
  const jsDOM: JSDOM = new JSDOM(urlSource);
  const dummyDom: JSDOM = new JSDOM();
  const nonAMP: JSDOM = new JSDOM(nonAMPSource);

  const isAMPDocumentExpected = (dom: JSDOM) => {
    const htmlElement = dom.window.document.querySelector('html');
  return htmlElement !== null && (htmlElement.hasAttribute('amp') || htmlElement.hasAttribute('⚡'));
  }

  t.is(isAMPDocument(jsDOM), isAMPDocumentExpected(jsDOM));
  t.is(isAMPDocument(dummyDom), isAMPDocumentExpected(dummyDom));
  t.is(isAMPDocument(nonAMP), isAMPDocumentExpected(nonAMP));
})