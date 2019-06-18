import { h } from 'preact';

interface Props {
  x: number;
  y: number;
  value: string | number;
}

export const YLabel = ({ x, y, value }: Props): JSX.Element => {
  const transOrigin: string = `${x} ${y}`;
  return (
    <text transform-origin={transOrigin} transform="rotate(40)" x={x} y={y}>
      {value}
    </text>
  );
};
