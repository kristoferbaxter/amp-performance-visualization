import { Component, h } from 'preact';

export interface BarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  style?: string;
  filter?: string;
}

export interface BarState {}

export default ({ x, y, width, height, style, filter }: BarProps, {  }: BarState): JSX.Element => {
  return (
    <rect x={x} y={y} width={width} height={height} style={style} filter={filter}>
      {/* <animate attributeName="height" from="0" to={height} dur="0.3s" fill="freeze" keyPoints="1;0"/> */}
    </rect>
  );
};
