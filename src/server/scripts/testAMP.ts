import getMetricsFromURL from './json-metrics';
const metricsArray: Promise<any>[] = [];

interface PagePerf {
    device: string;
    networkSpeed: string;
    metrics: string[];
}

export default async function getMetricsFromURLs(urls: Array<string>, downSpeed: number, upSpeed: number, lat: number): Promise<PagePerf> {
    
    let device ='iPhone 8'

    urls.forEach(async element => {
        metricsArray.push(getMetricsFromURL(element, downSpeed, upSpeed, lat));
    });

    const result = await Promise.all(metricsArray);

    return {
        device,
        networkSpeed: `downspeed: ${downSpeed}kbps`,
        metrics: result
    };
}