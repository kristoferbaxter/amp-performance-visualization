import test from 'ava';
import { getNetworkConfiguration, NetworkConfiguration, getNetworkPresets, NamedNetworkPreset, setCachedNetworkPresets } from '../configuration/network-configuration';
import { Configuration } from '../configuration/configuration';

test('Network Configuration Retrieved', async t => {
  const pathToNetwork = './config/network.json';

  const networkConfigurationActual: NetworkConfiguration | null = await getNetworkConfiguration(pathToNetwork);
  
  const networkConfigurationExpected: NetworkConfiguration | null = await new Configuration<NetworkConfiguration>(pathToNetwork).get();
  
  t.deepEqual(networkConfigurationActual, networkConfigurationExpected);
})

test('Networks Presets retrieved', async t =>{
  const pathToNetwork = './config/network.json';
  const NetworkConfiguration: NetworkConfiguration | null = await getNetworkConfiguration(pathToNetwork);
  if (NetworkConfiguration === null) {
    console.log('Invalid Path');
    return;
  }

  const networks: NamedNetworkPreset[] = getNetworkPresets(NetworkConfiguration);
  const networksExpected: NamedNetworkPreset[] = NetworkConfiguration.use.map(name => ({
    name,
    ...NetworkConfiguration.presets[name],
  }));

  t.deepEqual(networks, networksExpected);

  setCachedNetworkPresets(networksExpected);

  t.is(getNetworkPresets(NetworkConfiguration), networksExpected);
})