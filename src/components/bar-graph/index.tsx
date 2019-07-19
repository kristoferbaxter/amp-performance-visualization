import { h } from 'preact';
import { TimeMetrics } from '../../../shared/interfaces';
import SVGLoader from '../loader';
import { Axis } from './bars/Axis';
import { Bar } from './bars/Bar';
import { ConfidenceLines } from './bars/ConfidenceLines';
import { DataPoint } from './bars/DataPoint';
import { SeparationLine } from './bars/SeparationLine';
import { Title } from './bars/Title';
import { XDivision } from './bars/XDivision';
import { XLabel } from './bars/XLabel';
import { YLabel } from './bars/YLabel';
import { METRIC_COLORS } from './constants';
import { HISTOGRAM_COLORS } from './constants';
import { GraphableData } from './graph-types';

export interface GraphProps {
  height: number;
  width: number;
  loading?: boolean;
  data?: GraphableData[];
  graphChoice?: keyof TimeMetrics;
}

export interface GraphState {}

function camelCaseToString(str: string) {
  const wordArr: string[] = [];
  for (const word of str.split(/(?=[A-Z])/)) {
    wordArr.push(word[0].toUpperCase() + word.slice(1));
  }
  return wordArr.join(' ');
}

export default ({ height, width, loading, data, graphChoice }: GraphProps): JSX.Element => {
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
      const { baseValues: baseValues, experimentValues: experimentValues, standardDeviationData: standardDeviationValues }: GraphableData = metric;
      if (standardDeviationValues) {
        maxDataArr.push(Math.max(...baseValues) + standardDeviationValues[0]);
        maxDataArr.push(Math.max(...experimentValues) + standardDeviationValues[1]);
        return maxDataArr;
      }
      maxDataArr.push(Math.max(...baseValues));
      maxDataArr.push(Math.max(...experimentValues));
      return maxDataArr;
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
      <Title x={width / 2} y={titleOffset} value={graphChoice !== undefined ? camelCaseToString(graphChoice) : 'Confidence Graph of all metrics'} />
      {divisions.map(value => (
        <g>
          <XDivision minX={0} maxX={width} y={height - value * heightRatio} />
          <XLabel x={-labelOffset} y={height - value * heightRatio} value={value} />
        </g>
      ))}
      {loading && <SVGLoader size={100} x={width / 2 - 50} y={height / 2 - 50} />}
      {data &&
        data.map((metric, dataIndex: number) => {
          const {
            name: metricName,
            baseValues: baseValues,
            experimentValues: experimentValues,
            standardDeviationData: standardDeviationValues,
          }: GraphableData = metric;

          const barWidth = columnWidth / (baseValues.length + 1);
          if (standardDeviationValues) {
            return (
              <g transform={`translate(${(dataIndex + 1) * columnWidth})`} key={metricName || ''}>
                {baseValues.map((metricValue: number, valueIndex: number) => {
                  const barColor = METRIC_COLORS[metricName || METRIC_COLORS.NONE];
                  const barHeight = metricValue * heightRatio;
                  return (
                    <g key={(metricName || '') + dataIndex + valueIndex}>
                      <DataPoint x={-barWidth} y={height - barHeight} radius={5} style={`fill:${barColor}`} />
                      <SeparationLine x={0} y={0} height={height} />
                    </g>
                  );
                })}
                {experimentValues.map((metricValue: number, valueIndex: number) => {
                  const barColor = METRIC_COLORS[metricName || METRIC_COLORS.NONE];
                  const barHeight = metricValue * heightRatio;
                  return (
                    <g key={(metricName || '') + dataIndex + valueIndex}>
                      <DataPoint x={valueIndex * barWidth - barWidth} y={height - barHeight} radius={5} style={`fill:${barColor}`} />
                    </g>
                  );
                })}

                <YLabel x={0} y={height + labelOffset} value={metricName || ''} />
              </g>
            );
          }
          return (
            <g transform={`translate(${(dataIndex + 1) * columnWidth})`} key={metricName || ''}>
              {baseValues.map((metricValue: number, valueIndex: number) => {
                const dataOrigin = 'base';
                const barColor = METRIC_COLORS[metricName] || HISTOGRAM_COLORS[dataOrigin];
                const barHeight = metricValue * heightRatio;
                return (
                  <g key={(metricName || '') + dataIndex + valueIndex}>
                    <Bar x={-barWidth} y={height - barHeight} width={barWidth} height={barHeight} style={`fill:${barColor}`} />
                  </g>
                );
              })}
              {experimentValues.map((metricValue: number, valueIndex: number) => {
                const dataOrigin = 'experiment';
                const barColor = METRIC_COLORS[metricName] || HISTOGRAM_COLORS[dataOrigin];
                const barHeight = metricValue * heightRatio;
                return (
                  <g key={(metricName || '') + dataIndex + valueIndex}>
                    <Bar x={0} y={height - barHeight} width={barWidth - 10} height={barHeight} style={`fill:${barColor}`} />
                  </g>
                );
              })}
              <YLabel x={0} y={height + labelOffset} value={metricName || ''} />
            </g>
          );
        })}
      <Axis minX={0} minY={0} maxX={width} maxY={height} />
    </svg>
  );
};
