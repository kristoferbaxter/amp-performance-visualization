import { TimeMetrics } from '../../../shared/interfaces';
import { GroupedMetrics } from './consolidator';

export interface ConsolidatedDataResult {
  baseMetrics?: GroupedMetrics;
  experimentMetrics?: GroupedMetrics;
  baseAverage?: TimeMetrics;
  baseStandardDeviation?: TimeMetrics;
  experimentAverage?: TimeMetrics;
  experimentStandardDeviation?: TimeMetrics;
}
