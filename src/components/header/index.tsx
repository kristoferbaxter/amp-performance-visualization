import { Component, h } from 'preact';
import { Link } from 'preact-router/match';
import * as style from './style.css';

export default class Header extends Component {
  public render() {
    return (
      <header class={style.header}>
        <h1 class={style.title}>AMP Performance Visualization</h1>
        <nav class={style.home}>
          <Link activeClassName={style.active} href="/">
            Home
          </Link>
        </nav>
      </header>
    );
  }
}
