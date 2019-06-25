import { Component, h } from 'preact';
import { ParsedData } from '../../../shared-interfaces/metrics-results';
import { Axis } from './Axis';
import { Bar } from './Bar';
import style from './Chart.css';
import { ConfidenceLines } from './ConfidenceLines';
import { ValueLabel } from './ValueLabel';
import { XDivision } from './XDivision';
import { XLabel } from './XLabel';
import { YLabel } from './YLabel';

interface Props {
  data: ParsedData[];
  svgWidth: number;
  svgHeight: number;
  axisWidth: number;
  axisHeight: number;
  xLabelWidth: number;
  axisOffset: number;
}
// average an array of numbers
function getAverage(numArray: number[]): number {
  let sum = 0;
  for (const num of numArray) {
    sum += num;
  }
  return sum / numArray.length;
}
// put the average of every metric into an array
function aggregateMetrics(data: ParsedData[]) {
  const aggregate: { [k: string]: number } = {};
  for (let i = 0; i < Object.keys(data[0]).length; i++) {
    const metrics: number[] = [];
    for (const metric of data) {
      metrics.push(Object.values(metric)[i]);
    }
    aggregate[Object.keys(data[0])[i]] = getAverage(metrics);
  }
  return aggregate;
}
// create an array with the sta deviation of each metric
function createConfidenceArray(data: ParsedData[]) {
  const confidence: { [k: string]: number } = {};
  for (let i = 0; i < Object.keys(data[0]).length; i++) {
    const metrics: number[] = [];
    for (const metric of data) {
      metrics.push(Object.values(metric)[i]);
    }
    confidence[Object.keys(data[0])[i]] = calculateStandardDeviation(metrics);
  }
  return confidence;
}
// calculate the standard deviation given an array of numbers
function calculateStandardDeviation(numArray: number[]): number {
  const average = getAverage(numArray);
  const indivMean = [];
  for (const num of numArray) {
    indivMean.push(Math.pow(num - average, 2));
  }
  return Math.sqrt(getAverage(indivMean));
}

export class ConfidenceChart extends Component<Props> {
  public static defaultProps = {
    svgHeight: 1200,
    svgWidth: 1000,
    axisHeight: 950,
    axisWidth: 950,
    xLabelWidth: 45,
    axisOffset: 10,
  };

  public render({ data, svgHeight, svgWidth, axisHeight, axisWidth, xLabelWidth, axisOffset }: Props): JSX.Element {
    const newData = aggregateMetrics(data);
    const confidence = createConfidenceArray(data);
    const maxDataArr = [];
    for (let i = 0; i < Object.values(newData).length; i++) {
      maxDataArr[i] = Object.values(newData)[i] + Object.values(confidence)[i];
    }
    const maxValue = Math.ceil(Math.max.apply(null, maxDataArr) / 1000) * 1000; // sets maxvalue to be the largest number in the confidence array raised to the nearest 10
    const numOfBars = Object.keys(newData).length + 1; // sets numOfBars to the number of frequency bar required for the graph
    const axisX = (x: number): number => (x / numOfBars) * axisWidth; // manipulates an x value to fit into the frame of the graph
    const axisY = (y: number): number => axisHeight - (y / maxValue) * axisHeight; // manipulates a y value to fit into the frame of the graph
    const valueArr = Object.values(newData);
    const keyArr = Object.keys(newData);
    const barWidth = svgWidth / 2 / numOfBars; // changing the 2 to another number will manipulate the width of the bars
    const divisions = [];
    const numOfDivisions = maxValue / 1000;
    for (let i = 1; i <= numOfDivisions - 1; i++) {
      // makes an array with the x values for where the divisions should be placed
      divisions.push((maxValue * i) / numOfDivisions);
    }
    return (
      <div class={style.graph}>
        <svg width={svgWidth} height={svgHeight}>
          {divisions.map(value => (
            <XLabel x={xLabelWidth} y={axisY(value)} value={value} />
          ))}
          {divisions.map(value => (
            <XDivision minX={svgWidth - axisWidth} maxX={svgWidth} y={axisY(value)} />
          ))}
          {valueArr.map((value, index) => (
            <Bar x={axisX(index + 1) - barWidth / 2 + (svgWidth - axisWidth)} y={axisY(value)} width={barWidth} height={axisHeight - axisY(value)} />
          ))}
          {Object.values(confidence).map((value, index) => (
            <ConfidenceLines
              x={axisX(index + 1) + (svgWidth - axisWidth)}
              minY={axisY(valueArr[index] - value)}
              maxY={axisY(valueArr[index] + value)}
              endLineLength={50}
            />
          ))}
          <Axis minX={svgWidth - axisWidth} minY={axisHeight} maxX={svgWidth} maxY={axisY(maxValue)} />
          {valueArr.map((value, index) => (
            <ValueLabel x={axisX(index + 1) - barWidth / 2 + (svgWidth - axisWidth)} y={axisY(value)} value={Math.round(value)} />
          ))}
          {keyArr.map((value, index) => (
            <YLabel x={axisX(index + 1) + (svgWidth - axisWidth)} y={axisHeight + axisOffset} value={value} />
          ))}
        </svg>
      </div>
    );
  }
}
