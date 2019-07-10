import { Component, h } from 'preact';
import { PerformancePassResults } from '../../../shared-interfaces/metrics-results';
import BarGraph from '../../components/barGraph';
import ConsolidatedDataProvider from '../../components/dataProviders';
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
// import { Component, h } from 'preact';
// import { data } from '../../../server/results/data';
// import { ParsedData } from '../../../shared-interfaces/metrics-results';
// import { DropDown } from '../../components/DropDown';
// import { BarChart } from '../../components/graph/BarChart';
// import { ConfidenceChart } from '../../components/graph/ConfidenceChart';
// import style from './style.css';
//
// interface Props {}
// interface State {
//   graphChoice: keyof ParsedData;
// }
//
// function isKeyOfParsedData(str: string): str is keyof ParsedData {
//   // TODO: This check could use the actual key names from ParsedData.
//   return typeof str === 'string';
// }
//
// export default class Home extends Component<Props, State> {
//   constructor(props: Props) {
//     super(props);
//     this.state = {
//       graphChoice: 'responseStart',
//     };
//   }
//   public updateGraph = (choice: string) => {
//     // Validate that choice is a keyof ParsedData.
//     if (isKeyOfParsedData(choice)) {
//       this.setState({ graphChoice: choice });
//     }
//   };
//   public render() {
//     return (
//       <div class={style.home}>
//         <h1>Performance Graph</h1>
//         <DropDown metrics={data.metrics} onSelection={this.updateGraph} />
//         <BarChart data={data.metrics} graphChoice={this.state.graphChoice} />
//         <ConfidenceChart data={data.metrics} />
//       </div>
//     );
//   }
// }
