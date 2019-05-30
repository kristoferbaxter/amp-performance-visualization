import { h } from 'preact';
import style from './index';
import {Chart} from './chart';
const Home = () => (
	<div class={style.home}>
		<h1>Home</h1>
		<p>Chooose a Device:</p>
		<select>
  			<option device="">Select a Device</option>
  			<option device="iPhone 6">iPhone 6</option>
  			<option device="iPhone 7">iPhone 7</option>
  			<option device="iPhone 8">iPhone 8</option>
		</select>
		<p>Chooose a Network Speed:</p>
		<select>
  			<option speed="">Select a Network Device</option>
  			<option speed="3G">3G</option>
  			<option speed="4G">4G</option>
  			<option speed="LTE">LTE</option>
		</select>

		<br></br>
		<Chart className = "graph" data={{
			timeTilStartRender: 923,
			timeTilPagePainted: 1200,
			timeTilInteractive: 560,
			timeTilFullyLoaded: 700,
			ampResourceWeight: 670
		}}/>

	</div>
);

export default Home;
