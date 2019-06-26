import { h } from 'preact';
import style from './Chart.css';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const Bar = ({ x, y, width, height }: Props): JSX.Element => <rect class={style.barChartRects} x={x} y={y} width={width} height={height} />;
