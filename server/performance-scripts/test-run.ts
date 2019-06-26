import fs from 'fs';
import multiRunMetrics from './metrics-from-url-array';

const urlArray: string[] = [
  'https://results.amarujala.com/amp/board/up-board/up-class-10th-result-2018',
  'https://m.timesofindia.com/home/education/news/west-bengal-hs-class-12th-results-soon-wbresults-nic-in-check-here/amp_articleshow/64488353.cms',

  'http://ww7.catnepal.com/amp/',
  'https://m.timesofindia.com/home/education/news/maharashtra-hsc-result-2018-date-msbshse-likely-to-declare-12th-results-in-may-end/amp_articleshow/64318659.cms',
  'https://genius.com/amp/Drake-duppy-freestyle-lyrics',
  'https://m.bebesymas.com/ser-padres/buscas-nombre-para-tu-bebe-101-nombres-de-nina-para-inspirarte/amp',
  'https://genius.com/amp/Kanye-west-lift-yourself-lyrics',
  'https://amp.mon-horoscope-du-jour.com/',
  'https://m.livehindustan.com/career/story-bihar-board-12th-result-2018-bseb-releasing-bihar-12th-result-2018-science-commerce-and-arts-today-at-4-30-pm-check-bihar-result-at-biharboard-ac-in-1998865.amp.html',
];

// Metrics returning all -1 means the url took longer than 1 minute 40 seconds to load
// Metrics returning all -2 means the url is not AMP
// Metrics returning all -3 means the program failed to go to the page

multiRunMetrics(urlArray, 1536, 750, 40).then(data => {
  fs.writeFile('server/results/amp-metrics.json', JSON.stringify(data, null, 2), err => {
    if (err) {
      throw err;
    }
    process.exit(0);
  });
});
