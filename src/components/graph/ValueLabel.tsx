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
  } // Puts the value label inside the bar and changes the color white if the bar is too close to the top
  return (
    <text fill={color} x={x} y={newY}>
      {value}
    </text>
  );
};
