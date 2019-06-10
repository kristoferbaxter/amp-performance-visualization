import { h } from 'preact';

export const YLabel = (props:{x:number,y:number,value:string | number}) => {
  const transOrigin:string = `${props.x} ${props.y}`
  return (
    <text transform-origin={transOrigin} transform="rotate(30)"
      x={props.x}
      y={props.y}
    >{props.value}</text>
  );
}

export default YLabel
