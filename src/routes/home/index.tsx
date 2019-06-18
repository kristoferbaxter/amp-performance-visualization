import { Component, h } from 'preact';
import { data } from '../../components/data';
import { DropDown } from '../../components/DropDown';
import { BarChart } from '../../components/graph/BarChart';
import * as style from './style.css';

interface Props {}
interface State {
  graphChoice: string;
}
export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      graphChoice: 'firstContentfulPaint', //  firstByte, pageLoad, interactive, firstContentfulPaint
    };
  }
  public render() {
    return (
      <div class={style.home}>
        <h1>Performance Graph</h1>
        <p>Device: {data.device}</p>
        <p>Network Speed: {data.networkSpeed}</p>
        <DropDown metrics={data.metrics} />
        <BarChart data={data.metrics} graphChoice={this.state.graphChoice} />
      </div>
    );
  }
}
