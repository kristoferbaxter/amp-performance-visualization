import { Component, h } from 'preact';
import "./LineChart.css";

interface Props{
  data: object;
  barColor: string;
  labelColor: string;
  svgWidth: number;
  svgHeight:number;
  barOffset:number;
}
interface State{

}
class LineChart extends Component<Props, State> {
  public static defaultProps = {
      data: [],
      barColor: 'blue',
      labelColor: 'red',
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
      const { data, svgHeight, barColor, barOffset } = this.props;
      let htmlString: string = '';
      const valueArr = Object.values(data);
      let height:number;
      for(let i = 0; i < valueArr.length; i++){
        height = this.getSvgY(valueArr[i]);
        htmlString+=`<rect
                        x=${this.getSvgX(i+1)-barOffset}
                        y=${height}
                        width=${barOffset*2}
                        height=${svgHeight-height}
                        style="fill:${barColor}"
                      />`
      }
      return (
        <g dangerouslySetInnerHTML={{__html: htmlString}}/>
      )
  }
  public makeValueLabels(){
      const { data, svgHeight, labelColor, barOffset } = this.props;
      let htmlString: string = '';
      const valueArr = Object.values(data);
      let height: number;
      for(let i = 0; i < valueArr.length; i++){
        height = this.getSvgY(valueArr[i]);
        htmlString+=`<text
                        x="${this.getSvgX(i+1)-barOffset}"
                        y="${height-1}"
                        style="fill:${labelColor}"
                      >${valueArr[i]}</text>`
      }
      return (
        <g dangerouslySetInnerHTML={{__html: htmlString}}/>
      )
  }
  public makeXAxisLabels(){
      const { data, svgHeight, labelColor, barOffset } = this.props;
      let htmlString: string ='';
      const keyArr = Object.keys(data);
      for(let i = 0; i < keyArr.length; i++){
        htmlString+=`<text
                        x="${this.getSvgX(i+1)-barOffset}"
                        y="${svgHeight+20}"
                        style="fill:${labelColor}"
                      >${keyArr[i]}</text>`
      }
      return (
        <g dangerouslySetInnerHTML={{__html: htmlString}}/>
      )
  }

  public makeAxis() {
      const minX = 0
      const maxX = this.getNumOfMetrics()+1
      const minY = 0
      const maxY = this.getMaxValue()
      return (
          <g className="lineChartAxis">
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
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {this.makeRects()}
              {this.makeAxis()}
              {this.makeValueLabels()}
              {this.makeXAxisLabels()}
          </svg>
      )
  }
}

export default LineChart
