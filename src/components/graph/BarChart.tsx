import { Component, h } from 'preact';
import { TimeMetrics } from '../../../shared-interfaces/metrics-results';
import { Axis } from './Axis';
import { Bar } from './Bar';
import style from './Chart.css';
import { ValueLabel } from './ValueLabel';
import { XDivision } from './XDivision';
import { XLabel } from './XLabel';
import { YLabel } from './YLabel';

interface Props {
  data: TimeMetrics[];
  graphChoice: keyof TimeMetrics;
  svgWidth: number;
  svgHeight: number;
  axisWidth: number;
  axisHeight: number;
  xLabelWidth: number;
  axisOffset: number;
  frequencyInterval: number;
  divisionInterval: number;
  barWidthRatio: number;
}

// grabs the values of the data the user wants and sorts them from least to greatest
function sortNeededData(data: TimeMetrics[], graphChoice: keyof TimeMetrics): number[] {
  const numArray: number[] = [];
  for (const metric of data) {
    numArray.push(metric[graphChoice]);
  }
  return numArray.sort((a, b) => a - b);
}
// makes an array based on the frequency of the numbers every 1000
function makeFrequencyArray(data: number[], frequencyInterval: number): number[] {
  const freqArray: number[] = [];
  let previousInterval = 0;
  let currentInterval = frequencyInterval;
  while (currentInterval <= data[data.length - 1] + frequencyInterval) {
    let count = 0;
    for (const num of data) {
      if (num > previousInterval && num <= currentInterval) {
        count++;
      }
    }
    previousInterval = currentInterval;
    currentInterval += frequencyInterval;
    freqArray.push(count);
  }
  return freqArray;
}

export class BarChart extends Component<Props> {
  public static defaultProps = {
    svgHeight: 1000,
    svgWidth: 1000,
    axisHeight: 950,
    axisWidth: 950,
    xLabelWidth: 50,
    axisOffset: 10,
    frequencyInterval: 1000,
    divisionInterval: 1,
    barWidthRatio: 2,
  };

  public render({
    data,
    svgHeight,
    svgWidth,
    axisHeight,
    axisWidth,
    xLabelWidth,
    axisOffset,
    graphChoice,
    frequencyInterval,
    divisionInterval,
    barWidthRatio,
  }: Props): JSX.Element {
    const sortedData = sortNeededData(data, graphChoice);
    const newData = makeFrequencyArray(sortedData, frequencyInterval);
    const maxValue = Math.ceil(Math.max.apply(null, Object.values(newData)) / 10) * 10; // sets maxvalue to be the largest number in the array raised to the nearest 10
    const numOfBars = newData.length + 1; // sets numOfBars to the number of frequency bar required for the graph
    const axisX = (x: number): number => (x / numOfBars) * axisWidth; // manipulates an x value to fit into the frame of the graph
    const axisY = (y: number): number => axisHeight - (y / maxValue) * axisHeight; // manipulates a y value to fit into the frame of the graph
    const barWidth = svgWidth / numOfBars / barWidthRatio; // changing the 2 to another number will manipulate the width of the bars
    const divisions = [];
    const numOfDivisions = maxValue / divisionInterval;
    for (let i = 1; i <= numOfDivisions - 1; i++) {
      // makes an array with the x values for where the divisions should be placed
      divisions.push((maxValue * i) / numOfDivisions);
    }
    return (
      <div class={style.graph}>
        <svg width={svgWidth} height={svgHeight}>
          {divisions.map(value => (
            <XLabel x={xLabelWidth - axisOffset} y={axisY(value)} value={value} />
          ))}
          {divisions.map(value => (
            <XDivision minX={svgWidth - axisWidth} maxX={svgWidth} y={axisY(value)} />
          ))}
          {newData.map((value, index) => (
            <Bar x={axisX(index + 1) - barWidth / 2 + (svgWidth - axisWidth)} y={axisY(value)} width={barWidth} height={axisHeight - axisY(value)} />
          ))}
          <Axis minX={svgWidth - axisWidth} minY={axisHeight} maxX={svgWidth} maxY={axisY(maxValue)} />
          {newData.map((value, index) => (
            <ValueLabel x={axisX(index + 1) - barWidth / 2 + (svgWidth - axisWidth)} y={axisY(value)} value={Math.round(value)} />
          ))}
          {newData.map((value, index) => (
            <YLabel x={axisX(index + 1) - barWidth / 2 + (svgWidth - axisWidth)} y={axisHeight + axisOffset} value={(index + 1) * 1000} />
          ))}
        </svg>
      </div>
    );
  }
}
