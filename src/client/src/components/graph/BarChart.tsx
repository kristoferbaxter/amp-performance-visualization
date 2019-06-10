import { Component, h } from 'preact';
import Axis from './Axis'
import Bar from './Bar'
import * as style from "./BarChart.css";
import ValueLabel from './ValueLabel'
import XDivision from './XDivision';
import XLabel from './XLabel';
import YLabel from './YLabel'

interface Props{
  data: {
    [key: string]: number
  }
  svgWidth: number;
  svgHeight:number;
  barOffset: number;
  axisOffset: number;
}

function getMaxValue(props: Props):number {
  const { data } = props;
  const onlyMetrics: number[] = Object.values(data);
  const maxValue = Math.max.apply(null, onlyMetrics);
  return Math.ceil(maxValue/1000)*1000 +1000;// rounds the number up to the nearest thousand and adds 1000 to give proper spacing
}
function getNumOfMetrics(props: Props):number {
  const { data } = props;
  return Object.keys(data).length+1
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
    axisOffset: 10,
  }

  public render() {
    const { data, svgHeight, svgWidth, axisOffset } = this.props;
    const valueArr = Object.values(data);
    const keyArr = Object.keys(data);
    const barWidth = (svgWidth/2)/getNumOfMetrics(this.props);// use num of divs and get an array to map the xlabels
    const divisions = [];
    const numOfDivisions = getMaxValue(this.props)/1000
    for(let i = 1; i<= numOfDivisions-1; i++){
      divisions.push(getMaxValue(this.props)*i/numOfDivisions);
    }
    return (
      <div className={style.graph}>
        <svg width="50" height={svgHeight} className={style.xLabel}>
          {
            divisions.map((value) => (
              <XLabel
                x={0}
                y={getSvgY(value, this.props)}
                value={value}
                />
            ))
          }
        </svg>
        <svg  width={svgWidth} height={svgHeight} className={style.graphMinusXLabel}>
          <g className={style.divisions}>
            {
              divisions.map((value) => (
                <XDivision
                  minX={0}
                  maxX={svgWidth}
                  y={getSvgY(value, this.props)}
                />
              ))
            }
          </g>
          <g className={style.barChartRects}>
            {
              valueArr.map((value, index) => (
                <Bar
                  x={getSvgX(index+1, this.props)-barWidth/2}
                  y={getSvgY(value, this.props)}
                  width={barWidth}
                  height={svgHeight-getSvgY(value, this.props)}
                />
              ))
            }
          </g>
          <g className={style.barChartAxis}>
            <Axis
              minX={getSvgX(0, this.props)}
              minY={getSvgY(0, this.props)}
              maxX={getSvgX(getNumOfMetrics(this.props), this.props)}// the +1 increases the length of the axis so it appears correctly
              maxY={getSvgY(getMaxValue(this.props), this.props)}
            />
          </g>
          <g>
            {
              valueArr.map((value, index) => (
                <ValueLabel
                  x={getSvgX(index+1, this.props)-barWidth/2}
                  y={getSvgY(value, this.props)}
                  value={Math.round(value)+" ms"}
                />
              ))
            }
          </g>
        </svg>
        <svg width ="100%">
          {
            keyArr.map((value, index) => (
              <YLabel
                x={getSvgX(index+1, this.props)+barWidth/2}
                y={axisOffset}
                value={value}
              />
            ))
          }
        </svg>
      </div>
    )
  }
}

export default BarChart
