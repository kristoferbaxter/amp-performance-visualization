import { Component, h } from 'preact';
import { Axis } from './Axis';
import { Bar } from './Bar';
import style from './BarChart.css';
import { Label } from './Label';

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
  barOffset: number;
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
    barOffset: 30,
  };

  public render({ data, svgHeight, svgWidth, barOffset }: Props): JSX.Element {
    const valueArr = Object.values(data);
    const keyArr = Object.keys(data);
    return (
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} class={style.graph} width={svgWidth} height={svgHeight}>
        <g class={style.barChartRects}>
          {valueArr.map((value, index) => (
            <Bar
              x={svgX(index, this.props) + barOffset}
              y={svgY(value, this.props)}
              width={svgWidth / 3 / numOfMetrics(this.props)} // the 2/3 scales the bars so they will always fit on the graph for "N" number of metrics
              height={svgHeight - svgY(value, this.props)}
            />
          ))}
        </g>
        <Axis
          minX={svgX(0, this.props)}
          minY={svgY(0, this.props)}
          maxX={svgX(numOfMetrics(this.props) + 1, this.props)} // the +1 increases the length of the axis so it appears correctly
          maxY={svgY(maxValue(this.props), this.props)}
        />
        <g>
          {valueArr.map((value, index) => (
            <Label x={svgX(index, this.props) + barOffset} y={svgY(value, this.props)} value={value} />
          ))}
        </g>
        <g>
          {keyArr.map((value, index) => (
            <Label x={svgX(index, this.props) + barOffset} y={svgHeight} value={value} />
          ))}
        </g>
      </svg>
    );
  }
}

export default BarChart;
