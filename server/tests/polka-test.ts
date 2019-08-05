import test from 'ava';
import { Polka } from '../polka';
import getPort from 'get-port';
const polka = require('polka');
const sirv = require('sirv');
const compression = require('compression')();

test('polka test', async t => {
  const testPolka = new Polka()
  const port: number = await getPort({ port: 3001 });

  testPolka.polka['test'] = {
    polka: polka()
          .use(
            compression,
            sirv('server', {
              maxAge: 100,
              immutable: true,
            }),
          )
          .listen(port),
        port,
  }

  t.is(await testPolka.get('test', 'server'), testPolka.polka['test']);

  const info = await testPolka.get('test2', 'server');

  t.is(await testPolka.get('test2', 'server'), info)

})