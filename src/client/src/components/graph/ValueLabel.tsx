import { h } from 'preact';

export const ValueLabel = (props:{x:number,y:number,value:string | number}) => {
  let newY = props.y
  let color = "black"
  if(props.y < 17){
    newY = props.y+17;
    color = "white"
  }
  return (
    <text fill = {color}
      x={props.x}
      y={newY}
    >{props.value}</text>
  );
}

export default ValueLabel
