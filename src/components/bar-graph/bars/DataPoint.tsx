import { Component, h } from 'preact';
export interface DataPointProps {
  x: number;
  y: number;
  radius: number;
  style?: string;
  filter?: string;
  key?: string;
}

export interface DataPointState {}

export const DataPoint = ({ x, y, radius, style, filter }: DataPointProps, {  }: DataPointState): JSX.Element => {
  return <circle cx={x} cy={y} r={radius} style={style} filter={filter} />;
};
