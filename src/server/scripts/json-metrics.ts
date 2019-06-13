/**
 * @fileoverview Description of this file.
 */

//=======Imports===========
import puppeteer from 'puppeteer';
import isAMP from './isAMPDocument';
import Statistics, {
    notAMP,
    snailURL,
    failedPageGoTo
} from './performanceData';
const performance = require('perf_hooks');

//networkidle0 means that there are no more than 0 network connections for atleast 500 milliseconds
const NAVIGATION_COMPLETE = 'networkidle0';

//===============Metrics Methods===============
//Time Until First Byte
const getTimeToFirstByte = (results: PerformanceTiming): number =>
    results.responseStart - results.navigationStart;

//Time Until Fully Loaded
const getTimeToPageLoaded = (results: PerformanceTiming): number =>
    results.loadEventEnd - results.navigationStart;

//Time Until Interactive
const getTimeToInteractive = (results: PerformanceTiming): number =>
    results.domInteractive - results.navigationStart;

//Time Until the First Contentful Paint
const getTimeToFirstContentfulPaint = (results: PerformanceTiming): number =>
    results.domLoading - results.navigationStart;

const getMetrics = async (
    url: string,
    downSpeed: number,
    upSpeed: number,
    lat: number
): Promise<Statistics> => {

    //Checking if the url is AMP
    if (!(await isAMP(url))) {
        return notAMP(url);
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    /*Emulating a Wifi connectiopuppeteer
    "/8" is included because netpuppeteerork speed is commonly measured in bits/s
    DevTools expects throughputspuppeteerin bytes/s*/
    const client = await page.target().createCDPSession();
    await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: (downSpeed * 1024) / 8,
        uploadThroughput: (upSpeed * 1024) / 8,
        latency: lat
    });

    //waits until the page is fully loaded
    try {
        await page.goto(url, {
            timeout: 0,
            waitUntil: NAVIGATION_COMPLETE
        });
    } catch (e) {
        return failedPageGoTo(url);
    }

    let statistics: Statistics = {
        url: url,
        responseStart: 0, //firstByte
        loadEventEnd: 0, //pageLoad
        domInteractive: 0, //interactive
        firstContentfulPaint: 0, //use Performance.metrics injected into webpage
        custom: {
          ampJavascriptSize: [
            {
                url: url,
                size: 0
            }
          ],
          installStyles: [0, 0],
          visible: 0,
          onFirstVisible: 0,  
          makeBodyVisible: 0,
          windowLoadEvent: 0,
          firstViewportReady: 0
        },
    }

    //Returning info
    try {
        statistics = await page.evaluate((): Statistics => {
            //Performance Metric results
            const results = JSON.parse(JSON.stringify(performance.timing));

            //AMP Resource Weight
            let weight = 0;
            const weightArray = performance
                .getEntriesByType('resource')
                .filter((item: PerformanceResourceTiming) => {

                    return (
                        item.initiatorType === 'script' &&
                        item.name.startsWith('https://cdn.ampproject.org/')
                    );
                });
            const transferSizes: Object[] = [];
            weightArray.forEach((element: PerformanceResourceTiming) => {
                transferSizes.push({
                    address: element.name,
                    tSize: element.transferSize
                 })
            });
            const ampTransferSizes = JSON.parse(JSON.stringify(transferSizes));

            //Performance Mark Values
            let marks: PerformanceEntryList;
            const markNames: string[] = [
                'is',
                'e_is',
                'visible',
                'ofv',
                'mbv',
                'ol',
                'pc'
            ];
            const markValues: number[] = [];
            markNames.forEach(element => {
                marks = performance
                    .getEntriesByType('mark')
                    .filter((item: PerformanceMark) =>
                        item.name.startsWith(element)
                    );
                if (marks[0]) {
                    let markTime = Math.round(marks[0].startTime * 1000) / 1000;
                    markValues.push(markTime);
                }
            });

            const performanceMarks = JSON.parse(JSON.stringify(markValues));

            return {
                url: url,
                responseStart: getTimeToFirstByte(results),
                loadEventEnd: getTimeToPageLoaded(results),
                domInteractive: getTimeToInteractive(results),
                firstContentfulPaint: getTimeToFirstContentfulPaint(results),
                custom: {
                    ampJavascriptSize: ampTransferSizes,
                    installStyles: [performanceMarks[0],performanceMarks[1]],
                    visible: performanceMarks,
                    onFirstVisible: performanceMarks[3],
                    makeBodyVisible: performanceMarks[4],
                    windowLoadEvent: performanceMarks[5],
                    firstViewportReady: performanceMarks[6]
                }
            };
        });
    } catch (e) {
        console.log(e)
        throw 'Page failed to evaluate functions within browser';
    }

    console.log('browser close');
    await browser.close();

    return statistics
};

const getResults = async (
    url: string,
    downSpeed: number,
    upSpeed: number,
    lat: number
) => {
    const slowURLReturn = snailURL(url)
    const slowURL = new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                slowURLReturn,
            });
        }, 115000);
    });

    const pageMetrics = getMetrics(url, downSpeed, upSpeed, lat);

    return await Promise.race([slowURL, pageMetrics]);
};

export default getResults;
