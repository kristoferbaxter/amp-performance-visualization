import { Component, h } from 'preact';
import { Axis } from './Axis';
import { Bar } from './Bar';
import style from './Chart.css';
import { ValueLabel } from './ValueLabel';
import { XDivision } from './XDivision';
import { XLabel } from './XLabel';
import { YLabel } from './YLabel';

interface Props {
  data: Array<{ [k: string]: number }>;
  graphChoice: string;
  svgWidth: number;
  svgHeight: number;
  axisWidth: number;
  axisHeight: number;
  xLabelWidth: number;
  axisOffset: number;
}

function sortNeededData(data: Array<{ [k: string]: number }>, graphChoice: string): number[] {
  const numArray: number[] = [];
  for (const metric of data) {
    numArray.push(metric[graphChoice]);
  }
  return numArray.sort((a, b) => a - b);
}
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
    const maxValue = Math.ceil(Math.max.apply(null, Object.values(newData)) / 10) * 10;
    const numOfBars = newData.length + 1;
    const axisX = (x: number): number => (x / numOfBars) * axisWidth;
    const axisY = (y: number): number => axisHeight - (y / maxValue) * axisHeight;
    const barWidth = svgWidth / 2 / numOfBars;
    const divisions = [];
    const numOfDivisions = maxValue / 10;
    for (let i = 1; i <= numOfDivisions - 1; i++) {
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
