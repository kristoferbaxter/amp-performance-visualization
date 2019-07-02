import { h } from 'preact';
import style from './XLabelValues.css';

interface Props {
  x: number;
  y: number;
  value: string | number;
}

export const XLabelValues = ({ x, y, value }: Props): JSX.Element => (
  <text class={style.xLabelValues} x={x} y={y}>
    {value}
  </text>
);
