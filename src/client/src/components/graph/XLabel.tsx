import { h } from 'preact';

export const XLabel = (props:{x:number,y:number,value:string | number}) => {
  /*let newY = props.y
  if(props.y < 17){//17 is the heigth of the text
    newY = 12;

  }*/
  return (
      <text
        x={props.x}
        y={props.y}>
        {props.value}
      </text>
  );
}

export default XLabel
