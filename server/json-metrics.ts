/**
 * @fileoverview Description of this file.
 */
const puppeteer = require('puppeteer');

 const jsonInfo = async () => {
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
        'downloadThroughput': 30 * 1024 * 1024 /8, 
        'uploadThroughput': 15 * 1024 * 1024 /8,
        'latency': 2
      })

    //waits until the page is fully loaded
    await page.goto('https://amp.dev/', {
        waitUntil: 'networkidle0'
    })
    
    //============================URL Portion============================
    const url = page.url();
    
    //============================Time Until First Byte============================
    let navigationStart = await page.evaluate(function() {
       return JSON.stringify(window.performance.timing.navigationStart);
    })
    let responseStart = await page.evaluate(function() {
        return JSON.stringify(window.performance.timing.responseStart);
    })
    let timeToFirstByte = (responseStart - navigationStart);

    //============================Time Until Fully Loaded============================
    let fullyLoadedPage = await page.evaluate(function() {
        return JSON.stringify(window.performance.timing.loadEventEnd)
    })
    let timeToPageLoaded = (fullyLoadedPage - navigationStart);

    //============================AMP Resource Weight============================
    let ampResourceWgt = await page.evaluate(function() {
        let weight = 0;
        let weightArray = performance.getEntriesByType('resource').filter(item => {
            return (item as PerformanceResourceTiming).initiatorType === 'script' && item.name.startsWith('https://cdn.ampproject.org/')})
        weightArray.forEach(element => {
            weight += (element as PerformanceResourceTiming).transferSize
        });
        return weight
    })


    //Setting up for JSON Stringify
    let metrics = {
        url: url,
        timeToFirstByte: timeToFirstByte,
        timeToPageLoaded: timeToPageLoaded,
        ampResourceWgt: ampResourceWgt
    }

    //Prints the information in a JSON format
    let json = JSON.stringify(metrics)
    console.log(`Metrics: ${json}`)
    


    
    
}

jsonInfo();

