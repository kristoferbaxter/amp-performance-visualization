import { Component, h, VNode } from 'preact';
import { PerformanceMarkers, PerformancePassResults } from '../../../shared-interfaces';
import { GraphableData } from '../bar-graph/graph-types';
// import consolidationWorker from 'workerize-loader!./consolidator';
import { consolidate } from './consolidator';
import { ConsolidatedDataResult } from './types';

interface ConsolidatedDataProviderProps {
  // baseMetrics: PerformancePassResults,
  // experimentMetrics: PerformancePassResults,
  render: (data: ConsolidatedDataRenderer) => VNode;
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

export default class ConsolidatedDataProvider extends Component<ConsolidatedDataProviderProps, ConsolidatedDataProviderState> {
  public async componentDidMount() {
    try {
      // const consolidator = consolidationWorker();
      const [baseMetricsInputData, experimentMetricsInputdata] = await Promise.all([
        import('../../../.metrics/base.json').then(module => module.default),
        import('../../../.metrics/experiment.json').then(module => module.default),
      ]);
      // const {baseMetrics, experimentMetrics} = await consolidator.consolidate(baseMetricsInputData, experimentMetricsInputdata, 0.5);
      const { baseMetrics, experimentMetrics } = await consolidate(baseMetricsInputData, experimentMetricsInputdata, 0.5);
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
}
