import { h } from 'preact';
import style from './BarChart.css';

interface Props {
  x: number;
  y: number;
  value: string | number;
}

export const YLabel = ({ x, y, value }: Props): JSX.Element => {
  return (
    <text class={style.yLabel} transform-origin={`${x} ${y}`} x={x} y={y}>
      {value}
    </text>
  );
};
