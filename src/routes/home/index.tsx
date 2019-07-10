import { Component, h } from 'preact';
import { data } from '../../../server/results/data';
import { TimeMetrics } from '../../../shared-interfaces/metrics-results';
import { DropDown } from '../../components/DropDown';
import { BarChart } from '../../components/graph/BarChart';
import { ConfidenceChart } from '../../components/graph/ConfidenceChart';
import style from './style.css';

interface Props {}
interface State {
  graphChoice: keyof TimeMetrics;
}

function isKeyOfParsedData(str: string): str is keyof TimeMetrics {
  // TODO: This check could use the actual key names from ParsedData.
  return typeof str === 'string';
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      graphChoice: 'responseStart',
    };
  }
  public updateGraph = (choice: string) => {
    // Validate that choice is a keyof ParsedData.
    if (isKeyOfParsedData(choice)) {
      this.setState({ graphChoice: choice });
    }
  };
  public render() {
    return (
      <div class={style.home}>
        <h1>Performance Graph</h1>
        <DropDown metrics={data.metrics.performance} onSelection={this.updateGraph} />
        <BarChart data={data.metrics.performance} graphChoice={this.state.graphChoice} />
        <ConfidenceChart data={data.metrics.performance} />
      </div>
    );
  }
}
