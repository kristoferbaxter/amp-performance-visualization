import {results} from './result'

interface Metrics{
  url: string,
  firstByte: number,
  pageLoad:number,
  interactive:number,
  firstContentfulPaint:number
}

function getMedian(numArray: number[]):number{
  const sortedArr = numArray.sort(function(a, b){return a - b});
  const midpoint = sortedArr.length/2
  return sortedArr.length % 2 !== 0 ? sortedArr[midpoint] : (sortedArr[midpoint - 1] + sortedArr[midpoint]) / 2;
}

function filterBadData(metricsArr:Metrics[]){
  return metricsArr.filter(metrics => !(Object.values(metrics)[1] < 50 || (Object.values(metrics)[0].includes("chrome-error:"))))
}

function aggregateMetrics(metricsArr:Metrics[]){
  const aggregate: {[k: string]: any} = {};
  const goodMetrics = filterBadData(metricsArr);
  for(let i = 1; i < Object.keys(goodMetrics[0]).length;i++){
    const metrics = [];
    for(let j = 0; j < goodMetrics.length; j++){
      metrics.push(Object.values(goodMetrics[j])[i]);
    }
    aggregate[Object.keys(goodMetrics[0])[i]] = getMedian(metrics);
  }
  return aggregate;
}


export const data =
  {
    device: results.device,
    networkSpeed: results.networkSpeed,
    metrics: aggregateMetrics(results.metrics)
  }

export default data;
