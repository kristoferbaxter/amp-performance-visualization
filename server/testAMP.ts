let json = require('./json-metrics')

let urlArray = ['https://www.google.com/amp/s/amp.cnn.com/cnn/2019/05/30/politics/f-35-accidental-sky-penis/index.html',
'https://www.google.com/amp/s/amp.cnn.com/cnn/2019/05/30/entertainment/r-kelly-new-sexual-assault-charges/index.html',
'https://www.google.com/amp/s/amp.cnn.com/cnn/2019/05/30/politics/paul-manafort-condo-trump-tower/index.html',
'https://www.google.com/amp/s/amp.cnn.com/cnn/2019/05/30/us/texas-brass-knuckles-trnd/index.html',
'https://www.google.com/amp/s/amp.cnn.com/cnn/videos/politics/2019/05/30/trump-mueller-statement-collins-dnt-lead-vpx.cnn',
'https://www.google.com/amp/s/www.cbssports.com/nba/news/warriors-vs-raptors-nba-finals-predictions-experts-pick-golden-state-to-three-peat-torn-on-how-long-series-will-last/amp/',
'https://www.google.com/amp/s/www.cbssports.com/nba/news/2019-nba-playoffs-warriors-vs-raptors-finals-schedule-series-results-live-stream-tv-channel-dates-times-odds/amp/']

let metricsArray: Promise<any>[] = [];

export default async function getMetricsFromURL(urls: Array<string>) {
    //hardcoded preset
    let device = 'Iphone 8'
    let downSpeed = 1000
    let upSpeed = 1000
    let lat = 2

    urls.forEach(async element => {
        metricsArray.push(json(element, downSpeed, upSpeed, lat));
    });

    const result = await Promise.all(metricsArray);

    return {
        device,
        networkSpeed: `downspeed: ${downSpeed}kbps`,
        metrics: result
    };
}

getMetricsFromURL(urlArray).then(data=>{
    console.log(data);
})
