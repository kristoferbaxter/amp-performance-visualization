import { Component, h } from 'preact';
import SVGLoader from '../loader';

import style from './bar-graph.css';

export interface GraphProps {
  height: number;
  width: number;
  xLabel?: string;
  loading?: boolean;
}

export interface GraphState {}

export interface GraphableData {
  data: Array<{
    [key: string]: number;
  }>;
}

export default ({ height, width, xLabel, loading }: GraphProps): JSX.Element => {
  return (
    <svg height={height} width={width}>
      <g>
        <line x1="20" y1="0" x2="20" y2={height - 20} class={style.axis} />
        <text x={(-1 * height) / 2} y={height} class={style.xlabel} transform={`rotate(90 20, ${height - 20})`}>
          {xLabel || 'time'}
        </text>
        <line x1="20" y1={height - 20} x2={width} y2={height - 20} class={style.axis} />
      </g>
      <g>{loading && <SVGLoader size={100} x={width / 2 - 50} y={height / 2 - 50} />}</g>
    </svg>
  );
};
