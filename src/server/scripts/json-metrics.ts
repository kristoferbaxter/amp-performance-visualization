/**
 * @fileoverview Description of this file.
 */
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const performance = require('perf_hooks')

interface PagePerformance {
    url: string;
    firstByte: number; 
    pageLoad: number;
    interactive: number;
    firstContentfulPaint: number;
    ampWeight: number;
    installStyles: number;
    endInstallStyles: number;
    visible: number;
    onFirstVisible: number;
    makeBodyVisible: number;
    windowLoadEvent: number;
    firstViewportReady: number
  }
  //URL provided is not AMP
  const NOT_AMP = -2;
  //networkidle0 means that there are no more than 0 network connections for atleast 500 milliseconds
  const NAVIGATION_COMPLETE = 'networkidle0'; 
//===============Metrics Methods===============
//Time Until First Byte
const getTimeToFirstByte = (results:PerformanceTiming):number => (results.responseStart - results.navigationStart);

//Time Until Fully Loaded
const getTimeToPageLoaded = (results:PerformanceTiming):number => (results.loadEventEnd - results.navigationStart);

//Time Until Interactive
const getTimeToInteractive = (results:PerformanceTiming) => (results.domInteractive - results.navigationStart);

//Time Until the First Contentful Paint
const getTimeToFirstContentfulPaint = (results:PerformanceTiming) => (results.domLoading - results.navigationStart);


const getMetrics = async (webpage: string, downSpeed: number, upSpeed: number, lat: number):Promise<PagePerformance> => {
    
    if(!(await isAMP(webpage))) {
        return {
            url: webpage,
            firstByte: NOT_AMP,
            pageLoad: NOT_AMP,
            interactive: NOT_AMP,
            firstContentfulPaint: NOT_AMP,
            ampWeight: NOT_AMP,
            installStyles: NOT_AMP,
            endInstallStyles: NOT_AMP,
            visible: NOT_AMP,
            onFirstVisible: NOT_AMP,
            makeBodyVisible: NOT_AMP,
            windowLoadEvent: NOT_AMP,
            firstViewportReady: NOT_AMP,
        }
    }
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //Sets the navigation timeout to 2 minutes
    

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
            timeout: 0,
            waitUntil: NAVIGATION_COMPLETE
        })
    } catch (e) {
        // return {
        //     url: webpage,
        //     firstByte: -1,
        //     pageLoad: -1,
        //     interactive: -1,
        //     firstContentfulPaint: -1,
        //     ampWeight: -1
        // } as PagePerformance
    }

    

    //Returning info
    const results = JSON.parse(await page.evaluate(() => {
        return JSON.stringify(performance.timing);
     }))

     //Returning AMP Resource Weight
     
    const ampWeight = JSON.parse(await page.evaluate(() => {
        let weight = 0;
        const weightArray = performance.getEntriesByType('resource').filter((item:PerformanceResourceTiming) => {
            return item.initiatorType === 'script' && item.name.startsWith('https://cdn.ampproject.org/')
        })
        weightArray.forEach((element:PerformanceResourceTiming) => {
            weight += element.transferSize
        });
        return JSON.stringify(weight)
    }))

    let marks:PerformanceEntryList;
    const performanceMarks:number[] = JSON.parse(await page.evaluate(() => {
        const markNames: string[] = ['is','e_is','visible','ofv','mbv','ol','pc'];
        const markValues: number[] = [];
        markNames.forEach((element) => {
            marks = performance.getEntriesByType('mark').filter((item:PerformanceMark) => 
                item.name.startsWith(element)
            );
            if(marks[0]){
            let markTime = (Math.round(marks[0].startTime * 1000))/1000
            markValues.push(markTime);
        }
        });

        return JSON.stringify(markValues);
    }))

    await browser.close()
    
    return {
        url: webpage,
        firstByte: getTimeToFirstByte(results),
        pageLoad: getTimeToPageLoaded(results),
        interactive: getTimeToInteractive(results),
        firstContentfulPaint: getTimeToFirstContentfulPaint(results),
        ampWeight: ampWeight,
        installStyles: performanceMarks[0],
        endInstallStyles: performanceMarks[1],
        visible: performanceMarks[2],
        onFirstVisible: performanceMarks[3],
        makeBodyVisible: performanceMarks[4],
        windowLoadEvent: performanceMarks[5],
        firstViewportReady: performanceMarks[6]
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
                firstContentfulPaint: -1,
                ampWeight: -1
            } as PagePerformance)
        },115000)
    })

    const pageMetrics = getMetrics(webpage, downSpeed, upSpeed, lat);

    return await Promise.race([
        slowURL,
        pageMetrics
    ]);
}
 
export default getResults

const isAMP = async (url: string): Promise<boolean> => {
    try {
        const response = await fetch(url);
        const bodyText = await response.text();
        if (/<html\s[^>]*(⚡|amp)[^>]*>/.test(bodyText)) {
            return true
        }
        return false;
    } catch(e) {
        return false
    }
}

