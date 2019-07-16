import { h } from 'preact';
import style from './XLabel.css';

interface Props {
  x: number;
  y: number;
  value: string | number;
}

export const XLabel = ({ x, y, value }: Props): JSX.Element => (
  <text class={style.xLabel} x={x} y={y}>
    {value}
  </text>
);
