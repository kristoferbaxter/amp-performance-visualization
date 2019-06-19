import { h } from 'preact';

interface Props {
  x: number;
  y: number;
  value: string | number;
}

export const YLabel = ({ x, y, value }: Props): JSX.Element => {
  return (
    <text transform-origin={`${x} ${y}`} x={x} y={y}>
      {value}
    </text>
  );
};
