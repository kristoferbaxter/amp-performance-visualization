import { Component, h } from 'preact';
import { ParsedData } from '../data';
import { Axis } from './Axis';
import { Bar } from './Bar';
import style from './Chart.css';
import { ValueLabel } from './ValueLabel';
import { XDivision } from './XDivision';
import { XLabel } from './XLabel';
import { YLabel } from './YLabel';

interface Props {
  data: ParsedData[];
  graphChoice: keyof ParsedData;
  svgWidth: number;
  svgHeight: number;
  axisWidth: number;
  axisHeight: number;
  xLabelWidth: number;
  axisOffset: number;
}

// grabs the values of the data the user wants and sorts them from least to greatest
function sortNeededData(data: ParsedData[], graphChoice: keyof ParsedData): number[] {
  const numArray: number[] = [];
  for (const metric of data) {
    numArray.push(metric[graphChoice]);
  }
  return numArray.sort((a, b) => a - b);
}
// makes an array based on the frequency of the numbers every 1000
function makeFrequencyArray(data: number[]): number[] {
  const freqArray: number[] = [];
  let previousInterval = 0;
  let currentInterval = 1000;
  while (currentInterval <= data[data.length - 1] + 1000) {
    let count = 0;
    for (const num of data) {
      if (num > previousInterval && num <= currentInterval) {
        count++;
      }
    }
    previousInterval = currentInterval;
    currentInterval += 1000;
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
  };

  public render({ data, svgHeight, svgWidth, axisHeight, axisWidth, xLabelWidth, axisOffset, graphChoice }: Props): JSX.Element {
    const sortedData = sortNeededData(data, graphChoice);
    const newData = makeFrequencyArray(sortedData);
    const maxValue = Math.ceil(Math.max.apply(null, Object.values(newData)) / 10) * 10; // sets maxvalue to be the largest number in the array raised to the nearest 10
    const numOfBars = newData.length + 1; // sets numOfBars to the number of frequency bar required for the graph
    const axisX = (x: number): number => (x / numOfBars) * axisWidth; // manipulates an x value to fit into the frame of the graph
    const axisY = (y: number): number => axisHeight - (y / maxValue) * axisHeight; // manipulates a y value to fit into the frame of the graph
    const barWidth = svgWidth / numOfBars / 2; // changing the 2 to another number will manipulate the width of the bars
    const divisions = [];
    const numOfDivisions = maxValue / 10;
    for (let i = 1; i <= numOfDivisions - 1; i++) {
      // makes an array with the x values for where the divisions should be placed
      divisions.push((maxValue * i) / numOfDivisions);
    }
    return (
      <div class={style.graph}>
        <svg width={svgWidth} height={svgHeight}>
          <g class={style.xLabel}>
            {divisions.map(value => (
              <XLabel x={xLabelWidth} y={axisY(value)} value={value} />
            ))}
          </g>
          <g class={style.divisions}>
            {divisions.map(value => (
              <XDivision minX={svgWidth - axisWidth} maxX={svgWidth} y={axisY(value)} />
            ))}
          </g>
          <g class={style.barChartRects}>
            {newData.map((value, index) => (
              <Bar
                x={axisX(index + 1) - barWidth / 2 + (svgWidth - axisWidth)}
                y={axisY(value)}
                width={barWidth}
                height={axisHeight - axisY(value)}
              />
            ))}
          </g>
          <g class={style.barChartAxis}>
            <Axis minX={svgWidth - axisWidth} minY={axisHeight} maxX={svgWidth} maxY={axisY(maxValue)} />
          </g>
          <g>
            {newData.map((value, index) => (
              <ValueLabel x={axisX(index + 1) - barWidth / 2 + (svgWidth - axisWidth)} y={axisY(value)} value={Math.round(value)} />
            ))}
          </g>

          <g>
            {newData.map((value, index) => (
              <YLabel x={axisX(index + 1) - barWidth / 2 + (svgWidth - axisWidth)} y={axisHeight + axisOffset} value={(index + 1) * 1000} />
            ))}
          </g>
        </svg>
      </div>
    );
  }
}
