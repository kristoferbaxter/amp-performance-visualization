import { Component, h } from 'preact';
import {Axis} from './Axis'
import Bar from './Bar'
import style from "./BarChart.css";
import Label from './Label'

interface Props{
  data: {
    timeToFirstByte: number,
    timeToFirstContentfulPaint: number,
    timeToInteractive: number,
    timeToPageLoad: number,
    ampResourceWgt: number
  }
  svgWidth: number;
  svgHeight:number;
  barOffset:number;
}

function getMaxValue(props: Props):number {
  const { data } = props;
  const onlyMetrics: number[] = Object.values(data);
  const maxValue = Math.max.apply(null, onlyMetrics);
  return Math.ceil(maxValue/100)*100;// rounds the number up to the nearest hundred
}
function getNumOfMetrics(props: Props):number {
  const { data } = props;
  return Object.keys(data).length
}
function getSvgX(x: number, props: Props):number {
  const { svgWidth } = props;
  return (x / getNumOfMetrics(props) * svgWidth);
}
function getSvgY(y:number, props: Props):number {
  const { svgHeight } = props;
  return svgHeight - (y / getMaxValue(props) * svgHeight);
}

class BarChart extends Component<Props, {}> {
  public static defaultProps = {
    svgHeight: 800,
    svgWidth: 800,
    barOffset: 30,
  }

  public render() {
    const { data, svgHeight, svgWidth, barOffset } = this.props;
    const valueArr = Object.values(data);
    const keyArr = Object.keys(data);
    return (
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={style.graph} width={svgWidth} height={svgHeight}>
        <g className={style.barChartRects}>
        {
          valueArr.map((value, index) => (
            <Bar
              x={getSvgX(index, this.props)+barOffset}
              y={getSvgY(value, this.props)}
              width={(svgWidth/3)/getNumOfMetrics(this.props)}// the 2/3 scales the bars so they will always fit on the graph for "N" number of metrics
              height={svgHeight-getSvgY(value, this.props)}
            />
          ))
        }
        </g>
        <Axis
          minX={getSvgX(0, this.props)}
          minY={getSvgY(0, this.props)}
          maxX={getSvgX(getNumOfMetrics(this.props)+1, this.props)}// the +1 increases the length of the axis so it appears correctly
          maxY={getSvgY(getMaxValue(this.props), this.props)}
        />
        <g>
        {
          valueArr.map((value, index) => (
            <Label
              x={getSvgX(index, this.props)+barOffset}
              y={getSvgY(value, this.props)}
              value={value}
            />
          ))
        }
        </g>
        <g>
        {
          keyArr.map((value, index) => (
            <Label
              x={getSvgX(index, this.props)+barOffset}
              y={svgHeight}
              value={value}
            />
          ))
        }
        </g>
      </svg>
    )
  }
}

export default BarChart
