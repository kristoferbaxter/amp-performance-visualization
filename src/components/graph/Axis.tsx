import { h } from 'preact';
import style from './Axis.css';

interface Props {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
// <g class={style.barChartAxis}>
//   <line x1={minX} y1={minY} x2={maxX} y2={minY} />
//   <line x1={minX} y1={minY} x2={minX} y2={maxY} />
//   <line x1={maxX} y1={maxY} x2={minX} y2={maxY} />
//   <line x1={maxX} y1={maxY} x2={maxX} y2={minY} />
// </g>
export const Axis = ({ minX, minY, maxX, maxY }: Props): JSX.Element => (
  <g class={style.barChartAxis}>
    <rect x={minX} y={minY} width={maxX - minX} height={maxY - minY} />
  </g>
);
