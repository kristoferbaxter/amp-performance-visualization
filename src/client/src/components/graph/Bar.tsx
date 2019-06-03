import { h } from 'preact';

export const Bar = (props:{x:number,y:number,width:number,height:number}) => {
  return (
    <rect
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
    />
  );
}

export default Bar
