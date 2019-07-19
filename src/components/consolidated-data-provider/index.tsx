import { Component, h, VNode } from 'preact';
// @ts-ignore
import consolidationWorker from 'workerize-loader!./consolidator';
import { PerformanceMarkers } from '../../../shared/interfaces';
import { GraphableData } from '../bar-graph/graph-types';
// import dataWorker from 'workerize-loader!../data-fetcher';
import { getPerformanceMetrics } from '../data-fetcher';
import { GroupedMetrics } from './consolidator';

interface ConsolidatedDataProviderProps {
  render: (data: ConsolidatedDataRenderer) => VNode;
}

interface ConsolidatedDataProviderState {
  baseMetrics?: GroupedMetrics;
  experimentMetrics?: GroupedMetrics;
  baseStandardDeviation?: PerformanceMarkers;
  experimentStandardDeviation?: PerformanceMarkers;
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
  public render(): JSX.Element {
    let data;
    const { baseMetrics, experimentMetrics, baseStandardDeviation, experimentStandardDeviation } = this.state;

    if (
      baseMetrics !== undefined &&
      experimentMetrics !== undefined &&
      baseStandardDeviation !== undefined &&
      experimentStandardDeviation !== undefined
    ) {
      const graphableData: GraphableData[] = [];

      for (const metric in baseMetrics) {
        if (baseMetrics.hasOwnProperty(metric)) {
          const comparisonMetric = {
            name: metric,
            baseValues: baseMetrics[metric as keyof PerformanceMarkers],
            experimentValues: experimentMetrics[metric as keyof PerformanceMarkers],
            standardDeviationData: [
              baseStandardDeviation[metric as keyof PerformanceMarkers],
              experimentStandardDeviation[metric as keyof PerformanceMarkers],
            ],
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
      const { baseMetrics, experimentMetrics, baseStandardDeviation, experimentStandardDeviation } = await consolidator.consolidate(
        baseMetricsInputData,
        experimentMetricsInputdata,
      );
      this.setState({
        baseMetrics,
        experimentMetrics,
        baseStandardDeviation,
        experimentStandardDeviation,
      });
    } catch (e) {
      console.log(e);
      this.setState({
        error: e.message,
      });
    }
  }
}
