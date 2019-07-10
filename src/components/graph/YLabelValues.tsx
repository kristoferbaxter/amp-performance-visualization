import { h } from 'preact';
import style from './YLabelValues.css';

interface Props {
  x: number;
  y: number;
  value: string | number;
}

export const YLabelValues = ({ x, y, value }: Props): JSX.Element => (
  <text class={style.yLabelValues} transform-origin={`${x} ${y}`} x={x} y={y}>
    {value}
  </text>
);
