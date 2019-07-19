import { TestPass } from '../../../shared/interfaces';

export async function getPerformanceMetrics(): Promise<TestPass[]> {
  const { control, experiment } = await fetch('/json-config/test.json').then(data => data.json());
  return (await Promise.all([
    fetch(`/results/${control}.json`).then(data => data.json()),
    fetch(`/results/${experiment}.json`).then(data => data.json()),
  ])) as TestPass[];
}
