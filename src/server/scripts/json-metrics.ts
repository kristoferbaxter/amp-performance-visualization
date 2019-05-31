/**
 * @fileoverview Description of this file.
 */
const puppeteer = require('puppeteer');

//===============Metrics Methods===============
//Time Until First Byte

const getTimeToFirstByte = async (results:PerformanceTiming) => {

    let timeToFirstByte = (results.responseStart - results.navigationStart);

    return timeToFirstByte
}

//Time Until Fully Loaded

const getTimeToPageLoaded = async (results:PerformanceTiming) => {
    let timeToPageLoaded = (results.loadEventEnd - results.navigationStart);

    return timeToPageLoaded
}

//AMP Resource Weight
/*let ampResourceWgt = async (results:PerformanceTiming) => {
    let weight = 0;
    let weightArray = performance.getEntriesByType('resource').filter(item => {
        return (item as PerformanceResourceTiming).initiatorType === 'script' && item.name.startsWith('https://cdn.ampproject.org/')})
    weightArray.forEach(element => {
        weight += (element as PerformanceResourceTiming).transferSize
    });
    return weight
}*/

module.exports = async (webpage: string, downSpeed: number, upSpeed: number, lat: number) => {
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
        'downloadThroughput':  downSpeed * 1024 * 1024 /8, 
        'uploadThroughput': upSpeed*1024 * 1024 /8,
        'latency': 0
      })

    //waits until the page is fully loaded
    await page.goto(webpage, {
        waitUntil: 'networkidle0'
    })
    
    //URL Portion
    const url = page.url();

    const results = JSON.parse(await page.evaluate(function() {
        return JSON.stringify(performance.timing);
     }))

    //Setting up for JSON Stringify
    return {
        url: url,
        timeToFirstByte: getTimeToFirstByte(results),
        timeToPageLoaded: getTimeToPageLoaded(results),
    }
}
 