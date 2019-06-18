import { Component, h } from 'preact';
import { data } from '../../components/data';
import { BarChart } from '../../components/graph/BarChart';
import * as style from './style.css';

interface Props {}
export default class Home extends Component<Props> {
  public render() {
    return (
      <div class={style.home}>
        <h1>Performance Graph</h1>
        <p>Device: {data.device}</p>
        <p>Network Speed: {data.networkSpeed}</p>
        <select>
          <option value="all" selected={true}>
            All Metrics
          </option>
          <option value="firstByte">First Byte</option>
          <option value="pageLoad">Page Load</option>
          <option value="interactive">Interactive</option>
          <option value="firstContentfulPaint">First Contentful Paint</option>
        </select>
        <BarChart data={data.metrics} />
      </div>
    );
  }
}
