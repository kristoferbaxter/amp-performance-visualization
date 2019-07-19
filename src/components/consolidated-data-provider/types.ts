import { PerformanceMarkers } from '../../../shared/interfaces';
import { GroupedMetrics } from './consolidator';

export interface ConsolidatedDataResult {
  baseMetrics?: GroupedMetrics;
  experimentMetrics?: GroupedMetrics;
  baseStandardDeviation?: PerformanceMarkers;
  experimentStandardDeviation?: PerformanceMarkers;
}
