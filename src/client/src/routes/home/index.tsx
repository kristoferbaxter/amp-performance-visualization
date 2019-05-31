import { Component,h } from "preact";
import LineChart from './LineChart';
import * as style from "./style.css";

interface Props {}
export default class Home extends Component<Props> {
    public render() {
        return (
            <div class={style.home}>
                <h1>Home</h1>
                <p>This is the Home component.</p>
                <svg className="graph" width="90%" height="1000">
            			<LineChart data={{
            				a: 92,
            				b: 5,
            				c: 56,
            				d: 7,
            				e: 67,
            				f: 3,
            				g:23,
            				h:5,
            				i:23,
            				j:2,
            				k:45
            			}}/>
            		</svg>
            </div>
        );
    }
}
