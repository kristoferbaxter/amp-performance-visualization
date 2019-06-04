/**
 * @fileoverview Description of this file.
 */
const puppeteer = require('puppeteer');


interface PagePerformance {
    url: string;
    firstByte: number; 
    pageLoad: number;
    interactive: number;
    firstContentfulPaint: number;
  }

//===============Metrics Methods===============
//Time Until First Byte
const getTimeToFirstByte = (results:PerformanceTiming):number => (results.responseStart - results.navigationStart);

//Time Until Fully Loaded
const getTimeToPageLoaded = (results:PerformanceTiming):number => (results.loadEventEnd - results.navigationStart);

//Time Until Interactive
const getTimeToInteractive = (results:PerformanceTiming) => (results.domInteractive - results.navigationStart);

//Time Until the First Contentful Paint
const getTimeToFirstContentfulPaint = (results:PerformanceTiming) => (results.domLoading - results.navigationStart);

//AMP Resource Weight
/*let ampResourceWgt = async (results:PerformanceTiming) => {
    let weight = 0;
    const weightArray = performance.getEntriesByType('resource').filter(item => {
        return (item as PerformanceResourceTiming).initiatorType === 'script' && item.name.startsWith('https://cdn.ampproject.org/')})
    weightArray.forEach(element => {
        weight += (element as PerformanceResourceTiming).transferSize
    });
    return weight
}*/

const getMetrics = async (webpage: string, downSpeed: number, upSpeed: number, lat: number):Promise<PagePerformance> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //Sets the navigation timeout to 2 minutes
    await page.setDefaultNavigationTimeout(120000)

    /*Emulating a Wifi connection
    "/8" is included because network speed is commonly measured in bits/s
    DevTools expects throughputs in bytes/s*/
    const client = await page.target().createCDPSession()
    await client.send('Network.emulateNetworkConditions', {
        'offline': false,
        'downloadThroughput':  downSpeed * 1024 /8, 
        'uploadThroughput': upSpeed * 1024 /8,
        'latency': lat
      })

    //waits until the page is fully loaded
    try {
        await page.goto(webpage, {
            waitUntil: 'networkidle0'
        })
    } catch (e) {
        //console.log(e);
    }
    //Returning info
    const results = JSON.parse(await page.evaluate(() => {
        return JSON.stringify(performance.timing);
     }))

    return {
        url:page.url(),
        firstByte: getTimeToFirstByte(results),
        pageLoad: getTimeToPageLoaded(results),
        interactive: getTimeToInteractive(results),
        firstContentfulPaint: getTimeToFirstContentfulPaint(results)
    }
}

const getResults = async (webpage: string, downSpeed: number, upSpeed: number, lat: number) => {
    const slowURL = new Promise (resolve => {
        setTimeout(() => {
            resolve({
                url: webpage,
                firstByte: -1,
                pageLoad: -1,
                interactive: -1,
                firstContentfulPaint: -1
            } as PagePerformance)
        },100000)
    })

    const pageMetrics = getMetrics(webpage, downSpeed, upSpeed, lat);

    return await Promise.race([slowURL, pageMetrics]);
}
 
export default getResults