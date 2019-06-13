import { Component, h } from 'preact';
import BarChart from '../../components/graph/BarChart';
import * as style from './style.css';

interface Props {}
export default class Home extends Component<Props> {
  public render() {
    return (
      <div class={style.home}>
        <h1>Performance Graph</h1>
      </div>
    );
  }
}
