import { Component, h } from 'preact';
import SVGLoader from '../loader';
import { Axis } from './bars/Axis';
import Bar from './bars/Bar';
import { METRIC_COLORS } from './constants';
import { GraphableData } from './graph-types';

import style from './bar-graph.css';

export interface GraphProps {
  height: number;
  width: number;
  xLabel?: string;
  loading?: boolean;
  data?: GraphableData[];
}

export interface GraphState {}

function round_to_precision(num: number, precision: number): number {
  return Math.round(num / precision) * precision;
}

export default ({ height, width, xLabel, loading, data }: GraphProps): JSX.Element => {
  let heightRatio = 1;
  let columnWidth = 0;
  if (data) {
    // get next closest 1000 of the highest of all value in the data to plot.
    const maxPlottableData = round_to_precision(Math.max(...data.map(dataPoints => dataPoints.values).flat()), 1000) + 1000;
    heightRatio = height / maxPlottableData;
    columnWidth = width / data.length;
  }
  return (
    <svg height={height} width={width}>
      <Axis minX={20} minY={0} maxX={width} maxY={height} />
      {loading && <SVGLoader size={100} x={width / 2 - 50} y={height / 2 - 50} />}
      {data &&
        data.map((metric, dataIndex: number) => {
          const { name: metricName, values: metricValues }: GraphableData = metric;
          const barColor = METRIC_COLORS[metricName || METRIC_COLORS.NONE];
          const barWidth = columnWidth / (metricValues.length + 1);
          return (
            <g transform={`translate(${Math.ceil(dataIndex * columnWidth) + 20})`} key={metricName || ''}>
              {metricValues.map((metricValue, valueIndex) => {
                const barHeight = metricValue * heightRatio;
                return (
                  <Bar
                    key={(metricName || '') + dataIndex + valueIndex}
                    x={valueIndex * barWidth + valueIndex * 1}
                    y={height - barHeight - 20}
                    width={barWidth}
                    height={barHeight}
                    style={`fill:${barColor}`}
                  />
                );
              })}
            </g>
          );
        })}
    </svg>
  );
};
