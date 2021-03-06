import { Component, h, VNode } from 'preact';
// @ts-ignore
import consolidationWorker from 'workerize-loader!./consolidator';
import { TimeMetrics } from '../../../shared/interfaces';
import { GraphableData } from '../bar-graph/graph-types';
import { getPerformanceMetrics } from '../data-fetcher';

interface HistogramDataProviderProps {
  render: (data: HistogramDataRenderer) => VNode;
  graphChoice: keyof TimeMetrics;
}

interface HistogramDataProviderState {
  baseFrequency?: TimeMetrics;
  experimentFrequency?: TimeMetrics;
  error?: string;
}

interface HistogramDataRenderer {
  error?: string;
  data?: GraphableData[];
}

const consolidator = consolidationWorker();

export default class HistogramDataProvider extends Component<HistogramDataProviderProps, HistogramDataProviderState> {
  public componentDidMount() {
    this.getAndProcessData();
  }
  public componentDidUpdate({ graphChoice }: HistogramDataProviderProps) {
    if (graphChoice !== this.props.graphChoice) {
      this.getAndProcessData();
    }
  }
  public render(): JSX.Element {
    let data;
    const { baseFrequency, experimentFrequency } = this.state;
    if (baseFrequency !== undefined && experimentFrequency !== undefined) {
      const graphableData: GraphableData[] = [];
      for (const metric in baseFrequency) {
        if (baseFrequency.hasOwnProperty(metric)) {
          const comparisonMetric = {
            name: metric,
            baseValues: [baseFrequency[metric as keyof TimeMetrics]],
            experimentValues: [experimentFrequency[metric as keyof TimeMetrics] !== undefined ? experimentFrequency[metric as keyof TimeMetrics] : 0],
          };
          graphableData.push(comparisonMetric);
        }
      }
      data = graphableData;
    }
    return <div>{this.props.render({ error: this.state.error, data })}</div>;
  }

  private async getAndProcessData(): Promise<void> {
    try {
      const [baseFrequencyInputData, experimentFrequencyInputdata] = await getPerformanceMetrics();
      const { baseFrequency, experimentFrequency } = await consolidator.consolidate(
        baseFrequencyInputData,
        experimentFrequencyInputdata,
        this.props.graphChoice,
      );
      this.setState({
        baseFrequency,
        experimentFrequency,
      });
    } catch (e) {
      console.log(e);
      this.setState({
        error: e.message,
      });
    }
  }
}
