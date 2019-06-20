import { h } from 'preact';

interface Props {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const Axis = ({ minX, minY, maxX, maxY }: Props): JSX.Element => (
  <g>
    <line x1={minX} y1={minY} x2={maxX} y2={minY} />
    <line x1={minX} y1={minY} x2={minX} y2={maxY} />
    <line x1={maxX} y1={maxY} x2={minX} y2={maxY} />
    <line x1={maxX} y1={maxY} x2={maxX} y2={minY} />
  </g>
);
