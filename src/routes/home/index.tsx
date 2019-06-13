import { Component, h } from 'preact';
import BarChart from '../../components/graph/BarChart';
import * as style from './style.css';

interface Props {}
export default class Home extends Component<Props> {
  public render() {
    return (
      <div class={style.home}>
        <h1>Home</h1>
        <p>This is the Home component.</p>
        <BarChart
          data={{
            timeToFirstByte: 93,
            timeToFirstContentfulPaint: 5,
            timeToInteractive: 56,
            timeToPageLoad: 7,
            ampResourceWgt: 64,
          }}
        />
      </div>
    );
  }
}
