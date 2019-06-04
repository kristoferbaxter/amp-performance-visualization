import getResults from './json-metrics';


interface PagePerf {
    device: string;
    networkSpeed: string;
    metrics: string[];
}



export default async function getMetricsFromURLs(urls: Array<string>, downSpeed: number, upSpeed: number, lat: number): Promise<PagePerf> {
    
    const device ='iPhone 8'
    const metricsArray: Promise<any>[] = [];

    urls.forEach(async element => {
        metricsArray.push(getResults(element, downSpeed, upSpeed, lat));
    });

    const result: string[] = await Promise.all(metricsArray);

    return {
        device,
        networkSpeed: `downspeed: ${downSpeed}kbps`,
        metrics: result
    };
}


    
