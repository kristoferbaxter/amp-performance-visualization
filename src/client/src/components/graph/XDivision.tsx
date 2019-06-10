import { h } from 'preact';

export const XDivision = (props:{maxX:number,minX:number, y:number}) => {
  return (
    <g>
        <line
            x1={props.minX}
            y1={props.y}
            x2={props.maxX}
            y2={props.y}
        />
    </g>
  );
}

export default XDivision
