import { Component, h } from 'preact';
import SVGLoader from '../loader';
import { METRIC_COLORS } from './constants';
import Bar from './graph';
import { GraphableData } from './graphTypes';

import style from './barGraph.css';

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
    console.log(data);
    // get next closest 1000 of the highest of all value in the data to plot.
    const maxPlottableData = round_to_precision(Math.max(...data.map(dataPoints => dataPoints.values).flat()), 1000) + 1000;
    heightRatio = height / maxPlottableData;
    columnWidth = width / data.length;
  }
  return (
    <svg height={height} width={width}>
      <g>
        <line x1="20" y1="0" x2="20" y2={height - 20} class={style.axis} />
        <text x={(-1 * height) / 2} y={height} transform={`rotate(90 20, ${height - 20})`}>
          {xLabel || 'time'}
        </text>
        <line x1="20" y1={height - 20} x2={width} y2={height - 20} class={style.axis} />
      </g>
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
