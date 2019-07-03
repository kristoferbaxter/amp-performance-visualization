export async function getPerformanceMetrics(): Promise<PerformancePassResults[]> {
  return await Promise.all([
    import('../../../.metrics/base.json').then(module => module.default),
    import('../../../.metrics/experiment.json').then(module => module.default),
  ]);
}
