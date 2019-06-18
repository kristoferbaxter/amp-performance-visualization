import { h } from 'preact';

interface Props {
  metrics: Array<{ [k: string]: number }>;
}

function getMetricNames(metrics: Array<{ [k: string]: number }>) {
  return Object.keys(metrics[0]);
}

export const DropDown = ({ metrics }: Props): JSX.Element => {
  const metricNames = getMetricNames(metrics);
  return (
    <select>
      <option value="all" selected={true}>
        All Metrics
      </option>
      {metricNames.map(value => (
        <option value={value}>{value}</option>
      ))}
    </select>
  );
};
