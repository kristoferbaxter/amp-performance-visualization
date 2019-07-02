import { h } from 'preact';
import style from './AxisLabel.css';

interface Props {
  x: number;
  y: number;
  value: string;
}

export const AxisLabel = ({ x, y, value }: Props): JSX.Element => (
  <text class={style.axisLabel} x={x} y={y}>
    {value}
  </text>
);
