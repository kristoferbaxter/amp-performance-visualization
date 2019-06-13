//===============Metrics Methods===============
//Time Until First Byte
export const getTimeToFirstByte = (results:PerformanceTiming):number => (results.responseStart - results.navigationStart);

//Time Until Fully Loaded
export const getTimeToPageLoaded = (results:PerformanceTiming):number => (results.loadEventEnd - results.navigationStart);

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