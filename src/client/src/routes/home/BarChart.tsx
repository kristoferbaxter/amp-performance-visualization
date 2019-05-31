import { Component, h } from 'preact';
import style from "./BarChart.css";

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
class BarChart extends Component<Props, {}> {
  public static defaultProps = {
      svgHeight: 800,
      svgWidth: 800,
      barOffset: 30,
  }
  public getMaxValue() {
    const { data } = this.props;
    const onlyMetrics = Object.values(data);
    const maxValue = Math.max.apply(null, onlyMetrics);
    return Math.round(maxValue/100)*100;
  }
  public getNumOfMetrics() {
    const { data } = this.props;
    return Object.keys(data).length
  }
  public getSvgX(x: number) {
    const { svgWidth } = this.props;
    return (x / this.getNumOfMetrics() * svgWidth);
  }
  public getSvgY(y:number) {
    const { svgHeight } = this.props;
    return svgHeight - (y / this.getMaxValue() * svgHeight);
  }
  public makeRects(){
    const { data, svgHeight, svgWidth, barOffset } = this.props;
    const valueArr = Object.values(data);
    return (
      <g className={style.barChartRects}>
      {
        valueArr.map((value, index) => (
          <rect
            x={this.getSvgX(index+1)-barOffset}
            y={this.getSvgY(value)}
            width={(svgWidth*2/3)/this.getNumOfMetrics()}
            height={svgHeight-this.getSvgY(value)}
          />
        ))
      }
      </g>
    )
  }
  public makeValueLabels(){
    const { data, barOffset } = this.props;
    const valueArr = Object.values(data);
    return (
      <g>
      {
        valueArr.map((value, index) => (
          <text
            x={this.getSvgX(index+1)-barOffset}
            y={this.getSvgY(value)}
          >{value}</text>
        ))
      }
      </g>
    )
  }
  public makeKeyLabels(){
      const { data, svgHeight, barOffset } = this.props;
      const keyArr = Object.keys(data);
      return (
        <g>
        {
          keyArr.map((key, index) => (
            <text transform="rotate(1 0,0)"
              x={this.getSvgX(index+1)-barOffset}
              y={svgHeight+20}
            >{key}</text>
          ))
        }
        </g>      )
  }

  public makeAxis() {
      const minX = 0
      const maxX = this.getNumOfMetrics()+1
      const minY = 0
      const maxY = this.getMaxValue()
      return (
          <g className={style.barChartAxis}>
              <line
                  x1={this.getSvgX(minX)}
                  y1={this.getSvgY(minY)}
                  x2={this.getSvgX(maxX)}
                  y2={this.getSvgY(minY)}
              />
              <line
                  x1={this.getSvgX(minX)}
                  y1={this.getSvgY(minY)}
                  x2={this.getSvgX(minX)}
                  y2={this.getSvgY(maxY)}
              />
          </g>
      )
  }
  public render() {
      const { svgHeight, svgWidth } = this.props;
      return (
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="graph" width="90%" height="1000">
              {this.makeRects()}
              {this.makeAxis()}
              {this.makeValueLabels()}
              {this.makeKeyLabels()}
          </svg>
      )
  }
}

export default BarChart
