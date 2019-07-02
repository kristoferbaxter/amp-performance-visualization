import { h } from 'preact';
import style from './Title.css';

interface Props {
  x: number;
  y: number;
  value: string;
}

export const Title = ({ x, y, value }: Props): JSX.Element => (
  <text class={style.title} x={x} y={y}>
    {value}
  </text>
);
