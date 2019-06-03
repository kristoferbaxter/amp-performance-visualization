import { h } from 'preact';

export const ValueLabel = (props:{x:number,y:number,value:string | number}) => {
  return (
    <text
      x={props.x}
      y={props.y}
    >{props.value}</text>
  );
}

export default ValueLabel
