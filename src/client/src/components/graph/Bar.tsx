import { h } from 'preact';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const Bar = ({ x, y, width, height }: Props): JSX.Element => <rect x={x} y={y} width={width} height={height} />;
