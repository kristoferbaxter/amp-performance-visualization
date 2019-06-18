import { h } from 'preact';

interface Props {
  metrics: Array<{ [k: string]: number }>;
  onSelection: () => void;
}

function getMetricNames(metrics: Array<{ [k: string]: number }>) {
  return Object.keys(metrics[0]);
}

export const DropDown = ({ metrics, onSelection }: Props): JSX.Element => {
  const metricNames = getMetricNames(metrics);
  return (
    <select id="dropDown" onChange={onSelection}>
      <option value="all" selected={true}>
        All Metrics
      </option>
      {metricNames.map(value => (
        <option value={value}>{value}</option>
      ))}
    </select>
  );
};
