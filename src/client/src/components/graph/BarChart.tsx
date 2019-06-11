import { Component, h } from 'preact';
import { Axis } from './Axis';
import { Bar } from './Bar';
import style from './BarChart.css';
import { ValueLabel } from './ValueLabel';
import { XDivision } from './XDivision';
import { XLabel } from './XLabel';
import { YLabel } from './YLabel';

interface Props {
  data: {
    timeToFirstByte: number;
    timeToFirstContentfulPaint: number;
    timeToInteractive: number;
    timeToPageLoad: number;
    ampResourceWgt: number;
  };
  svgWidth: number;
  svgHeight: number;
  axisOffset: number;
}

interface State {}

const maxValue = ({ data }: Props): number => Math.ceil(Math.max.apply(null, Object.values(data)));
const numOfMetrics = ({ data }: Props): number => Object.keys(data).length;
const svgX = (x: number, props: Props): number => (x / numOfMetrics(props)) * props.svgWidth;
const svgY = (y: number, props: Props): number => props.svgHeight - (y / maxValue(props)) * props.svgHeight;

class BarChart extends Component<Props, State> {
  public static defaultProps = {
    svgHeight: 800,
    svgWidth: 800,
    axisOffset: 30,
  };

  public render({ data, svgHeight, svgWidth, axisOffset }: Props): JSX.Element {
    const valueArr = Object.values(data);
    const keyArr = Object.keys(data);
    const barWidth = svgWidth / 2 / numOfMetrics(this.props); // use num of divs and get an array to map the xlabels
    const divisions = [];
    const numOfDivisions = maxValue(this.props) / 1000;
    for (let i = 1; i <= numOfDivisions - 1; i++) {
      divisions.push((maxValue(this.props) * i) / numOfDivisions);
    }
    return (
      <div className={style.graph}>
        <svg width="50" height={svgHeight} className={style.xLabel}>
          {divisions.map(value => (
            <XLabel x={0} y={svgY(value, this.props)} value={value} />
          ))}
        </svg>
        <svg width={svgWidth} height={svgHeight} className={style.graphMinusXLabel}>
          <g className={style.divisions}>
            {divisions.map(value => (
              <XDivision minX={0} maxX={svgWidth} y={svgY(value, this.props)} />
            ))}
          </g>
          <g className={style.barChartRects}>
            {valueArr.map((value, index) => (
              <Bar
                x={svgX(index + 1, this.props) - barWidth / 2}
                y={svgY(value, this.props)}
                width={barWidth}
                height={svgHeight - svgY(value, this.props)}
              />
            ))}
          </g>
          <g className={style.barChartAxis}>
            <Axis
              minX={svgX(0, this.props)}
              minY={svgY(0, this.props)}
              maxX={svgX(numOfMetrics(this.props), this.props)} // the +1 increases the length of the axis so it appears correctly
              maxY={svgY(maxValue(this.props), this.props)}
            />
          </g>
          <g>
            {valueArr.map((value, index) => (
              <ValueLabel x={svgX(index + 1, this.props) - barWidth / 2} y={svgY(value, this.props)} value={Math.round(value) + ' ms'} />
            ))}
          </g>
        </svg>
        <svg width="100%">
          {keyArr.map((value, index) => (
            <YLabel x={svgX(index + 1, this.props) + barWidth / 2} y={axisOffset} value={value} />
          ))}
        </svg>
      </div>
    );
  }
}

export default BarChart;
