import { PerformancePassResults } from '../../../shared/interfaces';

export async function getPerformanceMetrics(): Promise<PerformancePassResults[]> {
  const { control, experiment } = await fetch('/config/test.json').then(data => data.json());
  return (await Promise.all([
    fetch(`/results/${control}.json`).then(data => data.json()),
    fetch(`/results/${experiment}.json`).then(data => data.json()),
  ])) as PerformancePassResults[];
}
