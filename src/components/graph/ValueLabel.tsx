import { h } from 'preact';

interface Props {
  x: number;
  y: number;
  value: string | number;
}

export const ValueLabel = ({ x, y, value }: Props): JSX.Element => {
  let newY = y;
  if (y < 17) {
    newY = y + 17;
  } // Puts the label under the top of the bar if the bar is too close to the top
  return (
    <text x={x} y={newY}>
      {value}
    </text>
  );
};
