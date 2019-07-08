import { PerformancePassResults } from '../../../shared/interfaces';

export async function getPerformanceMetrics(): Promise<PerformancePassResults[]> {
  const { control, experiment } = await import('../../../output/config/test.json').then(module => module.default);
  return (await Promise.all([
    import(`../../../output/results/${control}.json`).then(module => module.default),
    import(`../../../output/results/${experiment}.json`).then(module => module.default),
  ])) as PerformancePassResults[];
}
