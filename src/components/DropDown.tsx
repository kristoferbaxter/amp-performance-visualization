import { Component, h } from 'preact';

interface Props {
  metrics: Array<{ [k: string]: number }>;
  onSelection: (choice: string) => void;
}

function getMetricNames(metrics: Array<{ [k: string]: number }>) {
  return Object.keys(metrics[0]);
}

export class DropDown extends Component<Props> {
  public handleSelection = (): void => {
    this.props.onSelection((this.base as HTMLSelectElement).selectedOptions[0].value);
  };

  public render({ metrics }: Props): JSX.Element {
    const metricNames = getMetricNames(metrics);
    return (
      <select onChange={this.handleSelection}>
        <option value="all" selected={true}>
          All Metrics
        </option>
        {metricNames.map(value => (
          <option value={value}>{value}</option>
        ))}
      </select>
    );
  }
}
// export const DropDown = ({ metrics, onSelection }: Props): JSX.Element => {
//   const metricNames = getMetricNames(metrics);
//   return (
//     <select id="dropDown" onChange={onSelection(this.base.value)}>
//       <option value="all" selected={true}>
//         All Metrics
//       </option>
//       {metricNames.map(value => (
//         <option value={value}>{value}</option>
//       ))}
//     </select>
//   );
// };
