import { Component, h } from 'preact';
import barStyle from './bars.css';
export interface BarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  style?: string;
  filter?: string;
  key?: string;
}

export interface BarState {}

export default ({ x, y, width, height, style, filter }: BarProps, {  }: BarState): JSX.Element => {
  return <rect x={x} y={y} width={width} height={height} style={style} filter={filter} class={barStyle.bar} />;
};
