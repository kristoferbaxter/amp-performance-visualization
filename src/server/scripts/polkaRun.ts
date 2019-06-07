const polka = require('polka');
import getMetricsFromURLs from './testAMP';

const urlArray =  ['https://results.amarujala.com/amp/board/up-board/up-class-10th-result-2018',
'https://m.timesofindia.com/home/education/news/west-bengal-hs-class-12th-results-soon-wbresults-nic-in-check-here/amp_articleshow/64488353.cms',
'https://www.merkur.de/welt/ramadan-2018-beginn-ende-fastenmonat-islam-id-al-fitr-alle-infos-mm-4972727.amp.html',
'http://ww7.catnepal.com/amp/',
'https://m.timesofindia.com/home/education/news/maharashtra-hsc-result-2018-date-msbshse-likely-to-declare-12th-results-in-may-end/amp_articleshow/64318659.cms',
'https://genius.com/amp/Drake-duppy-freestyle-lyrics',
'https://m.bebesymas.com/ser-padres/buscas-nombre-para-tu-bebe-101-nombres-de-nina-para-inspirarte/amp',
'https://genius.com/amp/Kanye-west-lift-yourself-lyrics',
'https://www.meteored.com.ar/tiempo-en_Buenos%2BAires-America%2BSur-Argentina-Ciudad%2BAutonoma%2Bde%2BBuenos%2BAires-SABE-1-13584_amp.html',
'http://amp.tudogostoso.com.br/receita/82681-massa-de-panqueca.html',
'https://amp.mon-horoscope-du-jour.com/',
'http://www.pornovideocd.com/amp/']


async function getMetrics(req: { metrics: string, query: {dSpeed: number, uSpeed: number, lat: number} }, res: any, next: () => void) {
  const down = Number(req.query.dSpeed)
  const up = Number(req.query.uSpeed)
  const latency = Number(req.query.lat)
  req.metrics = JSON.stringify(await getMetricsFromURLs(urlArray,down,up,latency), null, 2)
  next();
}

function two(req: { foo: string; }, res: any, next: () => void) {
  req.foo = '...needs better demo 😔';
  next();
}

polka()
  .use(getMetrics, two)
  .get('/amp/api/getperformancedata', (req: { metrics: string }, res: { setHeader: (arg0: string, arg1: string) => void; end: (arg0: any) => void; }) => {
    console.log(`~> Hello World`);
    res.setHeader('Content-type', 'application/json');
    res.end(req.metrics);
  })
  .listen(3000, (err: any) => {
    if (err) throw err;
    console.log(`> Running on localhost:3000`);
  });