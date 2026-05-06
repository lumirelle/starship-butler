import type { RC, RCOptions } from 'starship-butler-utils/config'
import { readUserConfig as _readUserConfig, upsertUserConfig as _upsertUserConfig } from 'starship-butler-utils/config'

/**
 * Reads the `config-provider` field from a user configuration file from `$XDG_CONFIG_HOME` or `$HOME/.config` and parses its contents.
 *
 * Default user configuration file name is ".butlerrc".
 *
 * @param options Options for reading the `config-provider` field from the configuration file. See {@link RCOptions}.
 * @returns The parsed configuration object.
 */
export function readUserConfig(options?: RCOptions): RC {
  return _readUserConfig(options)['config-provider'] ?? {}
}

/**
 * Updates or writes a configuration object to the 'config-provider' field in a file in `$XDG_CONFIG_HOME` or `$HOME/.config`.
 *
 * Default user configuration file name is ".butlerrc".
 *
 * @param config The configuration object to update or write to the 'config-provider' field. See {@link RC}.
 * @param options Options for updating or writing the configuration file. See {@link RCOptions}.
 * @returns The updated configuration object if the file existed, otherwise void.
 */
export function upsertUserConfig(config: RC, options?: RCOptions): RC | void {
  const result = _upsertUserConfig({
    'config-provider': config,
  }, options)
  return result && result['config-provider']
}
