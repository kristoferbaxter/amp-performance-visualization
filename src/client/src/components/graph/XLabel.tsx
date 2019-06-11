import { h } from 'preact';

interface Props {
  x: number;
  y: number;
  value: string | number;
}

export const XLabel = ({ x, y, value }: Props): JSX.Element => (
  <text alignment-baseline="middle" x={x} y={y}>
    {value}
  </text>
);
