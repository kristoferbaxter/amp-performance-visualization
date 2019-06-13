import { h } from 'preact';

interface Props {
  x: number;
  y: number;
  value: number | string;
}

export const Label = ({ x, y, value }: Props): JSX.Element => (
  <text x={x} y={y}>
    {value}
  </text>
);
