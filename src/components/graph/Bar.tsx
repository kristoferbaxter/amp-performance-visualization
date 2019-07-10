import { h } from 'preact';
import style from './Bar.css';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export const Bar = ({ x, y, width, height, color }: Props): JSX.Element => (
  <rect class={style.barChartRects} style={`fill:${color}`} x={x} y={y} width={width} height={height} />
);
