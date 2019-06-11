import { h } from 'preact';
import style from './Axis.css'

interface Props{
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
}

export const Axis = ({minX, minY, maxX, maxY}: Props) => (
    <g className = {style.barChartAxis}>
        <line
            x1={minX}
            y1={minY}
            x2={maxX}
            y2={minY}
        />
        <line
            x1={minX}
            y1={minY}
            x2={minX}
            y2={maxY}
        />
    </g>
)
