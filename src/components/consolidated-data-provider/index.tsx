import { Component, h, VNode } from 'preact';
import consolidationWorker from 'workerize-loader!./consolidator';
import { PerformanceMarkers, PerformancePassResults } from '../../../shared-interfaces';
import { GraphableData } from '../bar-graph/graph-types';
// import dataWorker from 'workerize-loader!../data-fetcher';
import { getPerformanceMetrics } from '../data-fetcher';
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
  public render() {
    let data;
    const { baseMetrics, experimentMetrics } = this.state;
    if (baseMetrics && experimentMetrics) {
      const graphableData: GraphableData[] = [];
      for (const metric in baseMetrics) {
        if (baseMetrics.hasOwnProperty(metric)) {
          const comparisonMetric = {
            name: metric,
            values: [baseMetrics[metric], experimentMetrics[metric]],
          };
          graphableData.push(comparisonMetric);
        }
      }

      data = graphableData;
    }
    return <div>{this.props.render({ error: this.state.error, data })}</div>;
  }
  private async getAndProcessData() {
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
