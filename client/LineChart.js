import { Component } from 'preact';
import './LineChart.css';

class LineChart extends Component {
    getMinValue() {
        let { data } = this.props;
        let onlyMetrics = Object.values(data);
        let minValue = Math.min.apply(null, onlyMetrics);
        return minValue;
    }
    getMaxValue() {
        let { data } = this.props;
        let onlyMetrics = Object.values(data);
        let maxValue = Math.max.apply(null, onlyMetrics);
        return maxValue;
    }
    getNumOfMetrics() {
        let { data } = this.props;
        return Object.keys(data).length
    }
    getSvgX(x) {
        let { svgWidth } = this.props;
        return (x / this.getNumOfMetrics() * svgWidth);
    }
    getSvgY(y) {
        let { svgHeight } = this.props;
        return svgHeight - (y / this.getMaxValue() * svgHeight);
    }
    makePath() {
        let { data, color } = this.props;
        let valueArr = Object.values(data);
        let pathD = ` M${this.getSvgX(1)} ${this.getSvgY(valueArr[0])}`
        for(let i = 1; i < valueArr.length; i++){
            pathD += ` L${this.getSvgX(i+1)} ${this. getSvgY(valueArr[i])}`
        }
        return (
            <path className="lineChartPath" d={pathD} style={{ stroke: color, fill:"none"}} />
        )
    }

    makeAxis() {//TODO have to change this. It will put the axis at the smallest points
        let minX = 0
        let maxX = this.getNumOfMetrics()
        let minY = this.getMinValue()
        let maxY = this.getMaxValue()
        let { heightOffset } = this.props
        return (
            <g className="linechart_axis">
                <line stroke="black" stroke-width="3"
                    x1={this.getSvgX(minX)}
                    y1={this.getSvgY(minY)}
                    x2={this.getSvgX(maxX)}
                    y2={this.getSvgY(minY)}
                />
                <line stroke="black" stroke-width="4"
                    x1={this.getSvgX(minX)}
                    y1={this.getSvgY(minY)}
                    x2={this.getSvgX(minX)}
                    y2={this.getSvgY(maxY)}
                />
            </g>
        )
    }


    render() {
        let { svgHeight, svgWidth } = this.props;
        return (
            <svg viewbox={`0 0 ${svgWidth} ${svgHeight}`}>
                {this.makePath()}
                {this.makeAxis()}
            </svg>
        )
    }
}
LineChart.defaultProps = {
    data: [],
    color: '#1174d1',
    svgHeight: 800,
    svgWidth: 800,
    heightOffset: 200,
}
export default LineChart
