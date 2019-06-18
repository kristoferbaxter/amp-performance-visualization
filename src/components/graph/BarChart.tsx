import { Component, h } from 'preact';
import { Axis } from './Axis';
import { Bar } from './Bar';
import style from './BarChart.css';
import { ValueLabel } from './ValueLabel';
import { XDivision } from './XDivision';
import { XLabel } from './XLabel';
import { YLabel } from './YLabel';

interface Props {
  data: Array<{ [k: string]: number }>;
  svgWidth: number;
  svgHeight: number;
  xLabelWidth: number;
  axisOffset: number;
}
interface State {
  graphChoice: string;
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

export class BarChart extends Component<Props, State> {
  public static defaultProps = {
    svgHeight: 800,
    svgWidth: 1000,
    xLabelWidth: 50,
    axisOffset: 10,
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      graphChoice: 'firstByte', //  firstByte, pageLoad, interactive, firstContentfulPaint
    };
  }

  public render({ data, svgHeight, svgWidth, xLabelWidth, axisOffset }: Props): JSX.Element {
    const sortedData = sortNeededData(data, this.state.graphChoice);
    console.log(sortedData);
    const newData = makeFrequencyArray(sortedData);
    console.log(newData);
    const maxValue = Math.ceil(Math.max.apply(null, Object.values(newData)) / 100) * 100;
    console.log(maxValue);
    const numOfBars = newData.length + 1;
    const svgX = (x: number): number => (x / numOfBars) * svgWidth;
    const svgY = (y: number): number => svgHeight - (y / maxValue) * svgHeight;
    const barWidth = svgWidth / 2 / numOfBars;
    const divisions = [];
    const numOfDivisions = maxValue / 50;
    for (let i = 1; i <= numOfDivisions - 1; i++) {
      divisions.push((maxValue * i) / numOfDivisions);
    }
    return (
      <div class={style.graph}>
        <svg width={xLabelWidth} height={svgHeight} class={style.xLabel}>
          {divisions.map(value => (
            <XLabel x={xLabelWidth - 5} y={svgY(value)} value={value} />
          ))}
        </svg>
        <svg width={svgWidth} height={svgHeight}>
          <g class={style.divisions}>
            {divisions.map(value => (
              <XDivision minX={0} maxX={svgWidth} y={svgY(value)} />
            ))}
          </g>
          <g class={style.barChartRects}>
            {newData.map((value, index) => (
              <Bar x={svgX(index + 1) - barWidth / 2} y={svgY(value)} width={barWidth} height={svgHeight - svgY(value)} />
            ))}
          </g>
          <g class={style.barChartAxis}>
            <Axis minX={svgX(0)} minY={svgY(0)} maxX={svgX(numOfBars)} maxY={svgY(maxValue)} />
          </g>
          <g>
            {newData.map((value, index) => (
              <ValueLabel x={svgX(index + 1) - barWidth / 2} y={svgY(value)} value={Math.round(value)} />
            ))}
          </g>
        </svg>
        <svg width="100%">
          {newData.map((value, index) => (
            <YLabel x={svgX(index + 1)} y={axisOffset} value={index * 1000} />
          ))}
        </svg>
      </div>
    );
  }
}
// const valueArr = Object.values(data);
// const keyArr = Object.keys(data);
// const axisOffset = 10;
// const xLabelWidth = 50;
// const barWidth = svgWidth / 2 / numOfMetrics(this.props);
// const divisions = [];
// const numOfDivisions = maxValue(this.props) / 1000;
// for (let i = 1; i <= numOfDivisions - 1; i++) {
//   divisions.push((maxValue(this.props) * i) / numOfDivisions);
// }
// return (
//   <div class={style.graph}>
//     <svg width={xLabelWidth} height={svgHeight} class={style.xLabel}>
//       {divisions.map(value => (
//         <XLabel x={xLabelWidth - 5} y={svgY(value, this.props)} value={value} />
//       ))}
//     </svg>
//     <svg width={svgWidth} height={svgHeight}>
//       <g class={style.divisions}>
//         {divisions.map(value => (
//           <XDivision minX={0} maxX={svgWidth} y={svgY(value, this.props)} />
//         ))}
//       </g>
//       <g class={style.barChartRects}>
//         {valueArr.map((value, index) => (
//           <Bar
//             x={svgX(index + 1, this.props) - barWidth / 2}
//             y={svgY(value, this.props)}
//             width={barWidth}
//             height={svgHeight - svgY(value, this.props)}
//           />
//         ))}
//       </g>
//       <g class={style.barChartAxis}>
//         <Axis
//           minX={svgX(0, this.props)}
//           minY={svgY(0, this.props)}
//           maxX={svgX(numOfMetrics(this.props), this.props)}
//           maxY={svgY(maxValue(this.props), this.props)}
//         />
//       </g>
//       <g>
//         {valueArr.map((value, index) => (
//           <ValueLabel x={svgX(index + 1, this.props) - barWidth / 2} y={svgY(value, this.props)} value={Math.round(value) + ' ms'} />
//         ))}
//       </g>
//     </svg>
//     <svg width="100%">
//       {keyArr.map((value, index) => (
//         <YLabel x={svgX(index + 1, this.props) + barWidth / 2} y={axisOffset} value={value} />
//       ))}
//     </svg>
//   </div>
// );
