import { Component, h, VNode } from 'preact';
// @ts-ignore
import consolidationWorker from 'workerize-loader!./consolidator';
import { PerformanceMarkers, PerformancePassResults } from '../../../shared-interfaces/metrics-results';
import { GraphableData } from '../barGraph/graphTypes';
// import dataWorker from 'workerize-loader!../data-fetcher';
import { getPerformanceMetrics } from '../dataFetcher';
import { consolidate } from './consolidator';

interface ConsolidatedDataProviderProps {
  render: (data: ConsolidatedDataRenderer) => VNode;
  percentile: number;
}

interface ConsolidatedDataProviderState {
  baseMetrics?: PerformanceMarkers;
  experimentMetrics?: PerformanceMarkers;
  error?: string;
}

interface ConsolidatedDataRenderer {
  error?: string;
  data?: GraphableData[];
}

const consolidator = consolidationWorker();

export default class ConsolidatedDataProvider extends Component<ConsolidatedDataProviderProps, ConsolidatedDataProviderState> {
  public componentDidMount() {
    this.getAndProcessData();
  }
  public componentDidUpdate({ percentile }: ConsolidatedDataProviderProps) {
    if (percentile !== this.props.percentile) {
      this.getAndProcessData();
    }
  }
  public render(): JSX.Element {
    let data;
    const { baseMetrics, experimentMetrics } = this.state;

    if (baseMetrics !== undefined && experimentMetrics !== undefined) {
      const graphableData: GraphableData[] = [];

      for (const metric in baseMetrics) {
        if (baseMetrics.hasOwnProperty(metric)) {
          const comparisonMetric = {
            name: metric,
            values: [baseMetrics[metric as keyof PerformanceMarkers], experimentMetrics[metric as keyof PerformanceMarkers]],
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
      // const {getPerformanceMetrics} = dataWorker();
      const [baseMetricsInputData, experimentMetricsInputdata] = await getPerformanceMetrics();
      // const {baseMetrics, experimentMetrics} = await consolidator.consolidate(baseMetricsInputData, experimentMetricsInputdata, 0.5);
      const { baseMetrics, experimentMetrics } = await consolidator.consolidate(
        baseMetricsInputData,
        experimentMetricsInputdata,
        this.props.percentile,
      );
      this.setState({
        baseMetrics,
        experimentMetrics,
      });
    } catch (e) {
      this.setState({
        error: e.message,
      });
    }
  }
}
