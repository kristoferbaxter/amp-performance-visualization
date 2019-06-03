import { h } from 'preact';
import style from './Axis.css'

export const Axis = (props:{minX:number,minY:number,maxX:number,maxY:number}) => {
  return (
    <g className = {style.barChartAxis}>
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
    </g>
  );
}

export default Axis
