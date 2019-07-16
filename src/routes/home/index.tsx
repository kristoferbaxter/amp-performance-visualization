import { Component, h } from 'preact';
import { PerformanceMarkers } from '../../../shared/interfaces';
import BarGraph from '../../components/bar-graph';
import ConsolidatedDataProvider from '../../components/consolidated-data-provider';
import { DropDown } from '../../components/dropDown/DropDown';
import HistogramDataProvider from '../../components/histogram-data-provider';
import style from './style.css';

interface Props {}
interface State {
  graphChoice: keyof PerformanceMarkers;
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
        <div class={style.percentileSelector} />
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
      </div>
    );
  }
}
