import getResults from './jsonMetrics';


interface PagePerf {
    device: string;
    networkSpeed: string;
    metrics: string[];
}

const DEVICE_NAME ='iPhone 8'
//haven't figured out how to get device info from user, so its hardcoded for now

export default async function getMetricsFromURLs(urls: Array<string>, downSpeed: number, upSpeed: number, lat: number): Promise<PagePerf> {
    const metricsArray: Promise<any>[] = [];

    urls.forEach(url =>  metricsArray.push(getResults(url, downSpeed, upSpeed, lat)));

    return {
        device: DEVICE_NAME,
        networkSpeed: `downspeed: ${downSpeed}kbps`,
        metrics: await Promise.all(metricsArray),
    };
}