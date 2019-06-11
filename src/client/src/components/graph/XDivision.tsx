import { h } from 'preact';

interface Props {
  maxX: number;
  minX: number;
  y: number;
}

export const XDivision = ({ maxX, minX, y }: Props): JSX.Element => <line x1={minX} y1={y} x2={maxX} y2={y} />;
