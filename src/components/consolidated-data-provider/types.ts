import { TimeMetrics } from '../../../shared/interfaces';
import { ConsolidatedData, GroupedMetrics } from './consolidator';

export interface ConsolidatedDataResult {
  baseMetrics?: GroupedMetrics;
  experimentMetrics?: GroupedMetrics;
  baseAverage?: ConsolidatedData;
  baseStandardDeviation?: ConsolidatedData;
  experimentAverage?: ConsolidatedData;
  experimentStandardDeviation?: ConsolidatedData;
}
