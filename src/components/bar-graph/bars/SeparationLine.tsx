import { h } from 'preact';
import style from './XDivision.css';

interface Props {
  x: number;
  y: number;
  height: number;
}

export const SeparationLine = ({ x, y, height }: Props): JSX.Element => <line class={style.divisions} x1={x} y1={y} x2={x} y2={y + height} />;
