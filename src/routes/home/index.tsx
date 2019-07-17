import { Component, h } from 'preact';
import { TimeMetrics } from '../../../shared/interfaces';
import BarGraph from '../../components/bar-graph';
import ConsolidatedDataProvider from '../../components/consolidated-data-provider';
import { DropDown } from '../../components/dropDown/DropDown';
import HistogramDataProvider from '../../components/histogram-data-provider';
import style from './style.css';

interface Props {}
interface State {
  graphChoice: keyof TimeMetrics;
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      graphChoice: 'responseStart',
    };
  }
  public updateGraph = (choice: string) => {
    // @ts-ignore
    this.setState({ graphChoice: choice });
  };
  public async componentDidMount() {}
  public render() {
    return (
      <div class={style.home}>
        <h1>Performance Graph</h1>
        <ConsolidatedDataProvider
          render={({ data, error }) => {
            if (!data && !error) {
              return <BarGraph height={1000} width={1000} loading={!data} />;
            } else if (error) {
              return <h1>ERROR! {error}</h1>;
            }
            return <BarGraph height={1000} width={1000} data={data} />;
          }}
        />
        <div class={style.percentileSelector}>
          <DropDown onSelection={this.updateGraph} />
        </div>
        <HistogramDataProvider
          graphChoice={this.state.graphChoice}
          render={({ data, error }) => {
            if (!data && !error) {
              return <BarGraph height={1000} width={1000} loading={!data} />;
            } else if (error) {
              return <h1>ERROR! {error}</h1>;
            }
            return <BarGraph height={1000} width={1000} data={data} />;
          }}
        />
      </div>
    );
  }
}
