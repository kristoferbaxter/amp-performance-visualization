import { h } from 'preact';

export const XDivision = (props:{maxX:number,minX:number, y:number}) => {
  return (

        <line
            x1={props.minX}
            y1={props.y}
            x2={props.maxX}
            y2={props.y}
        />
  );
}

export default XDivision
