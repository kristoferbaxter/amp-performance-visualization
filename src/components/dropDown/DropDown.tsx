import { Component, h } from 'preact';
import { PerformanceMarkers } from '../../../shared/interfaces';

interface Props {
  onSelection: (choice: string) => void;
}

export class DropDown extends Component<Props> {
  public handleSelection = (): void => {
    this.props.onSelection((this.base as HTMLSelectElement).selectedOptions[0].value);
  };

  public render(): JSX.Element {
    const metrics: PerformanceMarkers = {
      responseStart: 0,
      loadEventEnd: 0,
      domInteractive: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      firstMeaningfulPaint: 0,
      installStyles: 0,
      installStylesDuration: 0,
      visible: 0,
      onFirstVisible: 0,
      makeBodyVisible: 0,
      windowLoadEvent: 0,
      firstViewportReady: 0,
    };
    return (
      <select onChange={this.handleSelection}>
        {Object.keys(metrics).map(value => (
          <option value={value}>{value}</option>
        ))}
      </select>
    );
  }
}
