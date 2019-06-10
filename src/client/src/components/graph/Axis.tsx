import { h } from 'preact';

export const Axis = (props:{minX:number,minY:number,maxX:number,maxY:number}) => {
  return (
    <g>
        <line
            x1={props.minX}
            y1={props.minY}
            x2={props.maxX}
            y2={props.minY}
        />
        <line
            x1={props.minX}
            y1={props.minY}
            x2={props.minX}
            y2={props.maxY}
        />
        <line
            x1={props.minX}
            y1={props.maxY}
            x2={props.maxX}
            y2={props.maxY}
        />
        <line
            x1={props.maxX}
            y1={props.maxY}
            x2={props.maxX}
            y2={props.minY}
        />
    </g>
  );
}

export default Axis
