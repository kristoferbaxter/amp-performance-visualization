import { h } from 'preact';
import SVGLoader from '../loader';
import { Axis } from './bars/Axis';
import { ConfidenceLines } from './bars/ConfidenceLines';
import { Title } from './bars/Title';
import { XDivision } from './bars/XDivision';
import { XLabel } from './bars/XLabel';
import { YLabel } from './bars/YLabel';

import Bar from './bars/Bar';
import { METRIC_COLORS } from './constants';
import { GraphableData } from './graph-types';

export interface GraphProps {
  height: number;
  width: number;
  loading?: boolean;
  data?: GraphableData[];
}

export interface GraphState {}

export default ({ height, width, loading, data }: GraphProps): JSX.Element => {
  let heightRatio = 1;
  let columnWidth = 0;
  let numOfDivisions = 1;
  const divisions: number[] = [];
  let divisionInterval;
  const viewBoxOffset = 40;
  const bottomOffset = 130;
  const labelOffset = 15;
  const titleOffset = -10;
  if (data) {
    // get next closest 1000 of the highest of all value in the data to plot.
    const maxDataArr: number[] = [];
    data.map(metric => {
      const { values: metricValues, standardDeviationData: standardDeviationValues }: GraphableData = metric;
      if (standardDeviationValues) {
        return metricValues.map((metricValue, valueIndex) => {
          maxDataArr.push(metricValue + standardDeviationValues[valueIndex]);
        });
      }
      return metricValues.map(metricValue => {
        maxDataArr.push(metricValue);
      });
    });
    const maxPlottableData =
      Math.max.apply(null, maxDataArr) < 100
        ? Math.ceil(Math.max.apply(null, maxDataArr) / 10) * 10
        : Math.ceil(Math.max.apply(null, maxDataArr) / 100) * 100; // sets maxvalue to be the largest number in the confidence array raised to the nearest 1000
    divisionInterval = Math.pow(
      10,
      maxPlottableData.toString().length === 1 ? maxPlottableData.toString().length - 1 : maxPlottableData.toString().length - 2,
    );
    heightRatio = height / maxPlottableData;
    columnWidth = width / (data.length + 1);
    numOfDivisions = maxPlottableData / divisionInterval;
    for (let i = 0; i <= numOfDivisions; i++) {
      divisions.push((maxPlottableData * i) / numOfDivisions);
    }
  }
  return (
    <svg height={height} width={width} viewBox={`${-viewBoxOffset} ${-viewBoxOffset} ${width + viewBoxOffset} ${height + bottomOffset}`}>
      <Title x={width / 2} y={titleOffset} value={'Confidence Graph of all metrics'} />
      {divisions.map(value => (
        <g>
          <XDivision minX={0} maxX={width} y={height - value * heightRatio} />
          <XLabel x={-labelOffset} y={height - value * heightRatio} value={value} />
        </g>
      ))}
      {loading && <SVGLoader size={100} x={width / 2 - 50} y={height / 2 - 50} />}
      {data &&
        data.map((metric, dataIndex: number) => {
          const { name: metricName, values: metricValues, standardDeviationData: standardDeviationValues }: GraphableData = metric;
          const barColor = METRIC_COLORS[metricName || METRIC_COLORS.NONE];
          const barWidth = columnWidth / (metricValues.length + 1);
          if (standardDeviationValues) {
            return (
              <g transform={`translate(${Math.ceil(dataIndex * columnWidth) + 20})`} key={metricName || ''}>
                {metricValues.map((metricValue, valueIndex) => {
                  const barHeight = metricValue * heightRatio;
                  return (
                    <g key={(metricName || '') + dataIndex + valueIndex}>
                      <Bar
                        x={(valueIndex + 1) * barWidth + valueIndex}
                        y={height - barHeight}
                        width={barWidth}
                        height={barHeight}
                        style={`fill:${barColor}`}
                      />
                      <ConfidenceLines
                        x={(valueIndex + 1) * barWidth + valueIndex + barWidth / 2}
                        maxY={height - barHeight + standardDeviationValues[valueIndex] * heightRatio}
                        minY={height - barHeight - standardDeviationValues[valueIndex] * heightRatio}
                        endLineLength={barWidth}
                      />
                    </g>
                  );
                })}
                <YLabel x={barWidth * 2} y={height + labelOffset} value={metricName || ''} />
              </g>
            );
          }
          return (
            <g transform={`translate(${Math.ceil(dataIndex * columnWidth) + 20})`} key={metricName || ''}>
              {metricValues.map((metricValue, valueIndex) => {
                const barHeight = metricValue * heightRatio;
                return (
                  <g key={(metricName || '') + dataIndex + valueIndex}>
                    <Bar
                      x={(valueIndex + 1) * barWidth + valueIndex}
                      y={height - barHeight}
                      width={barWidth}
                      height={barHeight}
                      style={`fill:${barColor}`}
                    />
                  </g>
                );
              })}
              <YLabel x={barWidth * 2} y={height + labelOffset} value={metricName || ''} />
            </g>
          );
        })}
      <Axis minX={0} minY={0} maxX={width} maxY={height} />
    </svg>
  );
};
