import { Component, h } from 'preact';
import { PerformancePassResults } from '../../../shared/interfaces';
import BarGraph from '../../components/bar-graph';
import ConsolidatedDataProvider from '../../components/consolidated-data-provider';
import style from './style.css';

interface Props {}
interface State {
  percentile: number;
}

export default class Home extends Component<Props, State> {
  public state = {
    percentile: 0.5,
  };
  constructor(props: Props) {
    super(props);
  }
  public async componentDidMount() {}
  public render() {
    return (
      <div class={style.home}>
        <h1>Performance Graph</h1>
        <div class={style.percentileSelector}>
          <select
            onChange={e => {
              const { target } = e;
              // @ts-ignore
              if (target && target.value) {
                this.setState({
                  // @ts-ignore
                  percentile: parseFloat(target.value),
                });
              }
            }}
          >
            <option value="0.5">P50</option>
            <option value="0.9">P90</option>
            <option value="0.95">P95</option>
          </select>
        </div>
        <ConsolidatedDataProvider
          percentile={this.state.percentile}
          render={({ data, error }) => {
            if (!data && !error) {
              return <BarGraph height={400} width={700} loading={!data} />;
            } else if (error) {
              return <h1>ERROR! {error}</h1>;
            }
            console.log({ data });
            return <BarGraph height={400} width={700} data={data} />;
          }}
        />
      </div>
    );
  }
}
