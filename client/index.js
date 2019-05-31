import { h } from 'preact';
import style from './index.css';
import LineChart from './LineChart';
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

export default Home;
