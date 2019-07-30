import test from 'ava';
import { URLConfiguration, getURLConfiguration } from '../configuration/url-configuration';
import { Configuration } from '../configuration/configuration';

test('URL configuration retrieved', async t => {
  const pathToURL = './config/urls.json';
  
  const URLConfigurationActual: URLConfiguration | null = await getURLConfiguration(pathToURL);
  
  const URLConfigurationExpected: URLConfiguration | null = await new Configuration<URLConfiguration>(pathToURL).get();
  
  t.deepEqual(URLConfigurationActual, URLConfigurationExpected);
})