import { h } from 'preact';

interface Props {
  x: number;
  y: number;
  value: string | number;
}
// Changing y puts the label under the top of the bar if the bar is too close to the top
export const ValueLabel = ({ x, y, value }: Props): JSX.Element => (
  <text x={x} y={y < 17 ? y + 17 : y}>
    {value === 0 ? '' : value}
  </text>
);
