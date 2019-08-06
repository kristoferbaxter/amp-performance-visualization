import { DOMCache } from '../cache/dom-cache';
import { VersionConfiguration } from '../configuration/test-configuration';
import { replace } from '../cache/document-replacement';
import ProgressBar from 'progress'
import { JSDOM } from 'jsdom';
import test from 'ava';

test('Version replaced correctly', async t => {
  const domCache = new DOMCache;
  const urls = ['https://genius.com/amp/Drake-duppy-freestyle-lyrics'];
  const versions: VersionConfiguration[] = [{name:'v1', rtv:'1234'}, {name: 'v2', rtv: '4321'}];
  const progressBar = new ProgressBar('', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: 10000,
  });
  const initialScripts1 = Array.from((await domCache.get(versions[0].rtv, urls[0])).window.document.querySelectorAll('script'));
  const initialScripts2 = Array.from((await domCache.get(versions[1].rtv, urls[0])).window.document.querySelectorAll('script'));
  await replace(versions, domCache, urls, progressBar);

  const version1Dom = (await domCache.get(versions[0].rtv, urls[0]));
  const version2Dom = (await domCache.get(versions[1].rtv, urls[0]));

  const version1Scripts = Array.from(version1Dom.window.document.querySelectorAll('script'));
  const version2Scripts = Array.from(version2Dom.window.document.querySelectorAll('script'));
  
  initialScripts1.forEach((script, index) => {
    if (script.src.startsWith('https://cdn.ampproject.org/v0/')) {
      const newSrc = script.src.replace('https://cdn.ampproject.org/v0/', `https://cdn.ampproject.org/v0/rtv/${versions[0].rtv}/`);
      t.is(newSrc, version1Scripts[index].src);
    } else if (script.src === 'https://cdn.ampproject.org/v0.js') {
      t.is(`https://cdn.ampproject.org/rtv/${versions[0].rtv}/v0.js`, version1Scripts[index].src);
    }
  });

  initialScripts2.forEach((script, index) => {
    if (script.src.startsWith('https://cdn.ampproject.org/v0/')) {
      const newSrc = script.src.replace('https://cdn.ampproject.org/v0/', `https://cdn.ampproject.org/v0/rtv/${versions[1].rtv}/`);
      t.is(newSrc, version2Scripts[index].src);
    } else if (script.src === 'https://cdn.ampproject.org/v0.js') {
      t.is(`https://cdn.ampproject.org/rtv/${versions[1].rtv}/v0.js`, version2Scripts[index].src);
    }
  });
});