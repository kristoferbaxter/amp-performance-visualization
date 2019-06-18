import { h } from 'preact';

interface Props {
  x: number;
  y: number;
  value: string | number;
}

export const ValueLabel = ({ x, y, value }: Props): JSX.Element => {
  let newY = y;
  let color = 'black';
  if (y < 17) {
    newY = y + 17;
    color = 'white';
  }
  if (value === 0) {
    value = '';
  }
  return (
    <text fill={color} x={x} y={newY}>
      {value}
    </text>
  );
};
