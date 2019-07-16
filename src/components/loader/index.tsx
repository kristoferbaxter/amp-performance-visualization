import { h } from 'preact';
import style from './loader.css';

export interface LoaderProps {
  size: number;
  x?: number;
  y?: number;
}

export default ({ size, x, y }: LoaderProps): JSX.Element => {
  return (
    <svg width={size} height={size} viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" class={style.loader} x={x || 0} y={y || 0}>
      <circle cx="12.5" cy="12.5" r="12.5">
        <animate attributeName="fill-opacity" begin="0s" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" />
      </circle>
      <circle cx="12.5" cy="52.5" r="12.5" fill-opacity=".5">
        <animate attributeName="fill-opacity" begin="100ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" />
      </circle>
      <circle cx="52.5" cy="12.5" r="12.5">
        <animate attributeName="fill-opacity" begin="300ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" />
      </circle>
      <circle cx="52.5" cy="52.5" r="12.5">
        <animate attributeName="fill-opacity" begin="600ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" />
      </circle>
      <circle cx="92.5" cy="12.5" r="12.5">
        <animate attributeName="fill-opacity" begin="800ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" />
      </circle>
      <circle cx="92.5" cy="52.5" r="12.5">
        <animate attributeName="fill-opacity" begin="400ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" />
      </circle>
      <circle cx="12.5" cy="92.5" r="12.5">
        <animate attributeName="fill-opacity" begin="700ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" />
      </circle>
      <circle cx="52.5" cy="92.5" r="12.5">
        <animate attributeName="fill-opacity" begin="500ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" />
      </circle>
      <circle cx="92.5" cy="92.5" r="12.5">
        <animate attributeName="fill-opacity" begin="200ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};
