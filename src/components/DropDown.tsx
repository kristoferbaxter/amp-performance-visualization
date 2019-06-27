import { Component, h } from 'preact';
import { PerformanceMetrics } from '../../shared-interfaces/metrics-results';

interface Props {
  metrics: PerformanceMetrics[];
  onSelection: (choice: string) => void;
}

export class DropDown extends Component<Props> {
  public handleSelection = (): void => {
    this.props.onSelection((this.base as HTMLSelectElement).selectedOptions[0].value);
  };

  public render({ metrics }: Props): JSX.Element {
    return (
      <select onChange={this.handleSelection}>
        {Object.keys(metrics[0]).map(value => (
          <option value={value}>{value}</option>
        ))}
      </select>
    );
  }
}
