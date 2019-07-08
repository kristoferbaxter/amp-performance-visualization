import { PerformanceMarkers } from '../../../shared/interfaces';

export interface ConsolidatedDataResult {
  baseMetrics?: PerformanceMarkers;
  experimentMetrics?: PerformanceMarkers;
}
