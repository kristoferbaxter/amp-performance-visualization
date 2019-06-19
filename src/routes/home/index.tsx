import { Component, h } from 'preact';
import { data } from '../../components/data';
import { DropDown } from '../../components/DropDown';
import { BarChart } from '../../components/graph/BarChart';
import { ConfidenceChart } from '../../components/graph/ConfidenceChart';
import * as style from './style.css';

interface Props {}
interface State {
  graphChoice: string;
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      graphChoice: 'responseStart', //  firstByte, pageLoad, interactive, firstContentfulPaint
    };
  }
  public updateGraph = (choice: string) => {
    this.setState({ graphChoice: choice });
  };
  public render() {
    return (
      <div class={style.home}>
        <h1>Performance Graph</h1>
        <DropDown metrics={data.metrics} onSelection={this.updateGraph} />
        <BarChart data={data.metrics} graphChoice={this.state.graphChoice} />
        <ConfidenceChart data={data.metrics} />
      </div>
    );
  }
}
