import { Component, h } from 'preact';
import { PerformancePassResults } from '../../../shared-interfaces';
import BarGraph, { GraphableData } from '../../components/bar-graph';
import ConsolidatedDataProvider from '../../components/consolidated-data-provider';
import style from './style.css';

interface Props {}
interface State {}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  public async componentDidMount() {}
  public render() {
    return (
      <div class={style.home}>
        <h1>Performance Graph</h1>
        <ConsolidatedDataProvider
          render={({ data, error }) => {
            if (!data && !error) {
              return <BarGraph height={400} width={700} loading={!data} />;
            } else if (error) {
              return <h1>ERROR! {error}</h1>;
            }

            return <BarGraph height={400} width={700} data={data} />;
          }}
        />
      </div>
    );
  }
}
