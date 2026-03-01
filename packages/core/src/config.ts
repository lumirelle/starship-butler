import type { ConfigProviderOptions } from 'starship-butler-config-provider'
import type { LoadConfigOptions, RCOptions } from 'starship-butler-utils/config'
import { createDefu } from 'defu'
import { loadConfig as _loadConfig, readUserRc } from 'starship-butler-utils/config'

/**
 * Type definition for Butler configuration.
 */
export interface ButlerConfig {
  /**
   * Configuration for `config-provider` package.
   */
  'config-provider': Partial<ConfigProviderOptions>
}

/**
 * Type definition for Butler configuration, excludes auto-generated fields.
 */
type SafeButlerConfig = Omit<Partial<ButlerConfig>, 'config-provider'> & {
  'config-provider'?: Omit<Partial<ConfigProviderOptions>, 'version'>
}

/**
 * Type helper for define butler config.
 *
 * @param config Configuration.
 * @returns Configuration as it is.
 */
export function defineButlerConfig(config: SafeButlerConfig): Partial<SafeButlerConfig> {
  return config
}

type LoadConfigT = Partial<ButlerConfig>

/**
 * Load user's configuration.
 *
 * @param options Config loading options.
 * @returns Configuration.
 */
export async function loadConfig(
  options?: RCOptions & LoadConfigOptions<LoadConfigT>,
): Promise<LoadConfigT> {
  const rc = readUserRc(options)
  const { config } = await _loadConfig<LoadConfigT>(options)
  const defu = createDefu((obj, key) => {
    // Ignore `config-provider.version` from `config`
    if (key === 'version') {
      return true
    }
    return false
  })
  const mergedConfig = defu(config, rc)
  return mergedConfig
}
