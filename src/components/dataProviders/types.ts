import { PerformanceMarkers } from '../../../shared-interfaces/metrics-results';

export interface ConsolidatedDataResult {
  baseMetrics?: PerformanceMarkers;
  experimentMetrics?: PerformanceMarkers;
}
