import { Component, h } from 'preact';
import SVGLoader from '../loader';
import { GraphableData } from './graph-types';

import style from './bar-graph.css';

export interface GraphProps {
  height: number;
  width: number;
  xLabel?: string;
  loading?: boolean;
  data?: GraphableData[];
}

export interface GraphState {}

export default ({ height, width, xLabel, loading, data }: GraphProps): JSX.Element => {
  if (data) {
    const columns = data.length;
  }
  return (
    <svg height={height} width={width}>
      <g>
        <line x1="20" y1="0" x2="20" y2={height - 20} class={style.axis} />
        <text x={(-1 * height) / 2} y={height} class={style.xlabel} transform={`rotate(90 20, ${height - 20})`}>
          {xLabel || 'time'}
        </text>
        <line x1="20" y1={height - 20} x2={width} y2={height - 20} class={style.axis} />
      </g>
      {loading && <SVGLoader size={100} x={width / 2 - 50} y={height / 2 - 50} />}
    </svg>
  );
};
