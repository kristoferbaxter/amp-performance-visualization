import { h } from 'preact';
import style from './ConfidenceLines.css';

interface Props {
  x: number;
  maxY: number;
  minY: number;
  endLineLength: number;
}

export const ConfidenceLines = ({ x, maxY, minY, endLineLength }: Props): JSX.Element => {
  if (minY < 0) {
    minY = 0;
  }
  return (
    <g class={style.confidenceLines}>
      <line x1={x} y1={minY} x2={x} y2={maxY} />
      <line x1={x - endLineLength / 2} y1={minY} x2={x + endLineLength / 2} y2={minY} />
      <line x1={x - endLineLength / 2} y1={maxY} x2={x + endLineLength / 2} y2={maxY} />
    </g>
  );
};
