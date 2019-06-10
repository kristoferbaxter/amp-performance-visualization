import { Component,h } from "preact";
import data from "../../components/data";
import BarChart from '../../components/graph/BarChart';
import * as style from "./style.css";

interface Props {}
export default class Home extends Component<Props> {
    public render() {
        return (
            <div class={style.home}>
                <h1>Performance Graph</h1>
                <p>Device: {data.device}</p>
                <p>Network Speed: {data.networkSpeed}</p>
            			<BarChart data= {data.metrics}/>
            </div>
        );
    }
}
