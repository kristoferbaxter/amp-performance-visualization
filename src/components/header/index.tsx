import { Component, h } from 'preact';
import { Link } from 'preact-router/match';
import * as style from './style.css';

export default class Header extends Component {
  public render() {
    return (
      <header class={style.header}>
        <h1>AMP Performance Visualization</h1>
        <nav>
          <Link activeClassName={style.active} href="/">
            Home
          </Link>
        </nav>
      </header>
    );
  }
}
