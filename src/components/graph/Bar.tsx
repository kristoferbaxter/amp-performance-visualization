import { h } from 'preact';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const Bar = ({ x, y, width, height }: Props): JSX.Element => <rect x={x} y={y} width={width} height={height} />;
// export const ValueLabel = ({ x, y, value }: Props): JSX.Element => {
//   let newY = y;
//   let color = 'black';
//   if (y < 17) {
//     newY = y + 17;
//     color = 'white';
//   }
//   return (
//     <text fill={color} x={x} y={newY}>
//       {value}
//     </text>
//   );
// };
