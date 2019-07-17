import { Component, h, VNode } from 'preact';
// @ts-ignore
import consolidationWorker from 'workerize-loader!./consolidator';
import { TimeMetrics } from '../../../shared/interfaces';
import { GraphableData } from '../bar-graph/graph-types';
// import dataWorker from 'workerize-loader!../data-fetcher';
import { getPerformanceMetrics } from '../data-fetcher';

interface ConsolidatedDataProviderProps {
  render: (data: ConsolidatedDataRenderer) => VNode;
}

interface ConsolidatedDataProviderState {
  baseMetrics?: TimeMetrics;
  experimentMetrics?: TimeMetrics;
  baseStandardDeviation?: TimeMetrics;
  experimentStandardDeviation?: TimeMetrics;
  error?: string;
}

interface ConsolidatedDataRenderer {
  error?: string;
  data?: GraphableData[];
  standardDeviationData?: GraphableData[];
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
            values: [baseMetrics[metric as keyof TimeMetrics], experimentMetrics[metric as keyof TimeMetrics]],
            standardDeviationData: [baseStandardDeviation[metric as keyof TimeMetrics], experimentStandardDeviation[metric as keyof TimeMetrics]],
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
