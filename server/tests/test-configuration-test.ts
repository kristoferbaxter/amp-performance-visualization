import test from 'ava';
import { TestConfiguration, getTestConfiguration, VersionConfiguration, getVersionConfiguration, setCachedVersionConfiguration } from '../configuration/test-configuration';
import { Configuration } from '../configuration/configuration';

test('Test Configuration Retrieved', async t => {
  const pathToNetwork = './config/test.json';

  const testConfigurationActual: TestConfiguration | null = await getTestConfiguration(pathToNetwork);
  
  const testConfigurationExpected: TestConfiguration | null = await new Configuration<TestConfiguration>(pathToNetwork).get();
  
  t.deepEqual(testConfigurationActual, testConfigurationExpected);
})

test('Version Configurarion retrieved from Test Configuration', async t => {
  const pathToTestConfig = './config/test.json';
  const TestConfiguration: TestConfiguration | null = await getTestConfiguration(pathToTestConfig);
  if (TestConfiguration === null) {
    console.log('Invalid Path');
    return;
  }

  const versions: VersionConfiguration[] = getVersionConfiguration(TestConfiguration);
  const versionsExpected: VersionConfiguration[] = Object.keys(TestConfiguration).map(key => {
    if (key !== 'executions') {
      if (key !== 'concurrency') {
        return {
          name: key,
          rtv: TestConfiguration[key],
        };
      }
    }

    return null;
  })
  .filter(Boolean) as VersionConfiguration[]

  t.deepEqual(versions, versionsExpected);

  setCachedVersionConfiguration(versionsExpected);

  t.is(getVersionConfiguration(TestConfiguration), versionsExpected);
})