import { TimeMetrics } from '../../../shared/interfaces';

export interface ConsolidatedDataResult {
  baseMetrics?: TimeMetrics;
  experimentMetrics?: TimeMetrics;
  baseStandardDeviation?: TimeMetrics;
  experimentStandardDeviation?: TimeMetrics;
}
