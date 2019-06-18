import { Component, h } from 'preact';
import { Axis } from './Axis';
import { Bar } from './Bar';
import style from './BarChart.css';
import { ValueLabel } from './ValueLabel';
import { XDivision } from './XDivision';
import { XLabel } from './XLabel';
import { YLabel } from './YLabel';

interface Props {
  data: { [k: string]: number };
  svgWidth: number;
  svgHeight: number;
}

interface State {}

const maxValue = ({ data }: Props): number => Math.ceil(Math.max.apply(null, Object.values(data)) / 1000) * 1000;
const numOfMetrics = ({ data }: Props): number => Object.keys(data).length + 1;
const svgX = (x: number, props: Props): number => (x / numOfMetrics(props)) * props.svgWidth;
const svgY = (y: number, props: Props): number => props.svgHeight - (y / maxValue(props)) * props.svgHeight;

export class StdvGraph extends Component<Props, State> {
  public static defaultProps = {
    svgHeight: 800,
    svgWidth: 800,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      graphChoice: '',
    };
  }

  public render() {
    return <p>hi</p>;
  }

  /*public static defaultProps = {
    svgHeight: 800,
    svgWidth: 800,
  };

  public render({ data, svgHeight, svgWidth }: Props): JSX.Element {
    const valueArr = Object.values(data);
    const keyArr = Object.keys(data);
    const axisOffset = 10;
    const xLabelWidth = 50;
    const barWidth = svgWidth / 2 / numOfMetrics(this.props);
    const divisions = [];
    const numOfDivisions = maxValue(this.props) / 1000;
    for (let i = 1; i <= numOfDivisions - 1; i++) {
      divisions.push((maxValue(this.props) * i) / numOfDivisions);
    }
    return (
      <div class={style.graph}>
        <svg width={xLabelWidth} height={svgHeight} class={style.xLabel}>
          {divisions.map(value => (
            <XLabel x={xLabelWidth - 5} y={svgY(value, this.props)} value={value} />
          ))}
        </svg>
        <svg width={svgWidth} height={svgHeight}>
          <g class={style.divisions}>
            {divisions.map(value => (
              <XDivision minX={0} maxX={svgWidth} y={svgY(value, this.props)} />
            ))}
          </g>
          <g class={style.barChartRects}>
            {valueArr.map((value, index) => (
              <Bar
                x={svgX(index + 1, this.props) - barWidth / 2}
                y={svgY(value, this.props)}
                width={barWidth}
                height={svgHeight - svgY(value, this.props)}
              />
            ))}
          </g>
          <g class={style.barChartAxis}>
            <Axis
              minX={svgX(0, this.props)}
              minY={svgY(0, this.props)}
              maxX={svgX(numOfMetrics(this.props), this.props)}
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
  }*/
}
