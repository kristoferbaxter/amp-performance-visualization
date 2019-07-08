/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Argv } from 'mri';
import { Configuration } from './configuration';

interface NetworkPreset {
  offline: boolean;
  downloadThroughput: number;
  uploadThroughput: number;
  latency: number;
}
export interface NamedNetworkPreset extends NetworkPreset {
  name: string;
}
export interface NetworkConfiguration {
  use: string[];
  presets: {
    [key: string]: NetworkPreset;
  };
}

let cachedNetworkPresets: NamedNetworkPreset[] | null = null;

/**
 * Retrieve the Network Configuration
 * @param args
 */
export async function getNetworkConfiguration(args: Argv): Promise<NetworkConfiguration | null> {
  return await new Configuration<NetworkConfiguration>(args.network).get();
}

/**
 * Retrieve the Network Presets from the Network Configuration
 * @param NetworkConfiguration
 */
export function getNetworkPresets(NetworkConfiguration: NetworkConfiguration): NamedNetworkPreset[] {
  if (cachedNetworkPresets !== null) {
    return cachedNetworkPresets;
  }

  return (cachedNetworkPresets = NetworkConfiguration.use.map(name => ({
    name,
    ...NetworkConfiguration.presets[name],
  })));
}