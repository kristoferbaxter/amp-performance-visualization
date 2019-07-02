import { Component, h } from 'preact';
import style from './style.css';

interface Props {}
interface State {}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  public render() {
    return (
      <div class={style.home}>
        <h1>Performance Graph</h1>
      </div>
    );
  }
}
