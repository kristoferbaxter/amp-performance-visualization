/**
 * @fileoverview Description of this file.
 */
import { h } from 'preact';
import LineChart from './LineChart';
import './chart.css';

export const Chart = (props) => {
    console.log(props);

    return (
        <svg className="graph" width="100%" height="1000">
            <LineChart data = {props.data}/>
        </svg>
    )

}
