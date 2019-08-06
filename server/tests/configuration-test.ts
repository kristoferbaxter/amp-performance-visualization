import test from 'ava';
import { Configuration } from '../configuration/configuration';
import { NetworkConfiguration, getNetworkConfiguration } from '../configuration/network-configuration';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

test('Configuration retrieved', async t =>{
  class ConfigurationTest<T> {
    public location: string;
    public cached!: T;
  
    constructor(location: string) {
      this.location = location;
    }
  }
  const pathToNetwork = './config/network.json';
  

  const test: NetworkConfiguration | null = await new Configuration<NetworkConfiguration>(pathToNetwork).get();

  const control: ConfigurationTest<NetworkConfiguration> = await new ConfigurationTest<NetworkConfiguration>(pathToNetwork);


  const contents: string = await fsPromises.readFile(path.resolve(control.location), 'utf8');
  control.cached = JSON.parse(contents);

  t.deepEqual(test, control.cached);

  const fakePath = './fake'
  const nullTest: NetworkConfiguration | null = await new Configuration<NetworkConfiguration>(fakePath).get();

  t.is(nullTest, null);
})