import { blue, green, magenta, red } from 'kleur';

export function info(text: string) {
  console.log(`\n${blue(text)}`);
}

export function error(text: string) {
  console.log(`\n${magenta(text)}`);
}

export function success(text: string) {
  console.log(`\n${green(text)}`);
}

export function logo(text: string) {
  console.log(`\n${red(text)}`);
}
