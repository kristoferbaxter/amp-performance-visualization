import { AMPEntry, ParsedData, PerformanceMetrics, Results, TestPass } from '../../shared-interfaces/metrics-results';
import { results } from './results';

function filterBadData(arrayOfResults: Results[]): Results[] {
  for (let i = 0; i < arrayOfResults.length; i++) {
    for (const j = 0; i < arrayOfResults[i].performance.length; i++) {
      if (arrayOfResults[i].performance[j].responseStart <= 0) {
        arrayOfResults[i].performance.splice(j, 1);
      }
    }
  }
  return arrayOfResults;
}

function parseMetrics(arrayOfResults: Results[]): ParsedData {
  const parsedGraphableData: PerformanceMetrics[] = [];
  const parsedTableData: AMPEntry[] = [];
  const goodMetrics = filterBadData(arrayOfResults);
  for (const metrics of goodMetrics) {
    for (const metric of metrics.performance) {
      parsedGraphableData.push(metric);
    }
    for (const metric of metrics.amp) {
      parsedTableData.push(metric);
    }
  }
  return {
    performance: parsedGraphableData,
    amp: parsedTableData,
  };
}

export const data = {
  metrics: parseMetrics(results.metrics),
};
