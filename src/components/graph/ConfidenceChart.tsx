import { Component, h } from 'preact';
import { Axis } from './Axis';
import { Bar } from './Bar';
import style from './Chart.css';
import { ConfidenceLines } from './ConfidenceLines';
import { ValueLabel } from './ValueLabel';
import { XDivision } from './XDivision';
import { XLabel } from './XLabel';
import { YLabel } from './YLabel';

interface Props {
  data: Array<{ [k: string]: number }>;
  svgWidth: number;
  svgHeight: number;
  axisWidth: number;
  axisHeight: number;
  xLabelWidth: number;
  axisOffset: number;
}

function getAverage(numArray: number[]): number {
  let sum = 0;
  for (const num of numArray) {
    sum += num;
  }
  return sum / numArray.length;
}

function aggregateMetrics(data: Array<{ [k: string]: number }>) {
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
function createConfidenceArray(data: Array<{ [k: string]: number }>) {
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
    const maxValue = Math.ceil(Math.max.apply(null, maxDataArr) / 1000) * 1000;
    const numOfBars = Object.keys(newData).length + 1;
    const axisX = (x: number): number => (x / numOfBars) * axisWidth;
    const axisY = (y: number): number => axisHeight - (y / maxValue) * axisHeight;
    const valueArr = Object.values(newData);
    const keyArr = Object.keys(newData);
    const barWidth = svgWidth / 2 / numOfBars;
    const divisions = [];
    const numOfDivisions = maxValue / 100;
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
            {valueArr.map((value, index) => (
              <Bar
                x={axisX(index + 1) - barWidth / 2 + (svgWidth - axisWidth)}
                y={axisY(value)}
                width={barWidth}
                height={axisHeight - axisY(value)}
              />
            ))}
          </g>
          <g class={style.confidenceLines}>
            {Object.values(confidence).map((value, index) => (
              <ConfidenceLines
                x={axisX(index + 1) + (svgWidth - axisWidth)}
                minY={axisY(valueArr[index] - value)}
                maxY={axisY(valueArr[index] + value)}
                endLineLength={50}
              />
            ))}
          </g>
          <g class={style.barChartAxis}>
            <Axis minX={svgWidth - axisWidth} minY={axisHeight} maxX={svgWidth} maxY={axisY(maxValue)} />
          </g>
          <g>
            {valueArr.map((value, index) => (
              <ValueLabel x={axisX(index + 1) - barWidth / 2 + (svgWidth - axisWidth)} y={axisY(value)} value={Math.round(value)} />
            ))}
          </g>
          <g class={style.yLabel}>
            {keyArr.map((value, index) => (
              <YLabel x={axisX(index + 1) + (svgWidth - axisWidth)} y={axisHeight + axisOffset} value={value} />
            ))}
          </g>
        </svg>
      </div>
    );
  }
}