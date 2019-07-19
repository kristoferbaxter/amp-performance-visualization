import { TimeMetrics } from '../../../shared/interfaces';
import { GroupedMetrics } from './consolidator';

export interface ConsolidatedDataResult {
  baseMetrics?: GroupedMetrics;
  experimentMetrics?: GroupedMetrics;
  baseStandardDeviation?: TimeMetrics;
  experimentStandardDeviation?: TimeMetrics;
}
