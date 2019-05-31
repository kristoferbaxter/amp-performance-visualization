let json = require('./json-metrics')
let metricsArray: Promise<any>[] = [];

export default async function getMetricsFromURL(urls: Array<string>, downSpeed: number, upSpeed: number, lat: number,) {
    
    let device ='iPhone 8'
    
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
