import { HistogramData } from './consolidator';

export interface HistogramDataResult {
  baseFrequency?: HistogramData;
  experimentFrequency?: HistogramData;
}
