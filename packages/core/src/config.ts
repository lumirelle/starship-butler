import type { LoadConfigOptions, RCOptions } from 'starship-butler-utils/config'
import type { ButlerConfig, SafeButlerConfig } from './types'
import { createDefu } from 'defu'
import { loadConfig as _loadConfig, readUserRc } from 'starship-butler-utils/config'

/**
 * Type helper for define butler config.
 *
 * @param config Configuration.
 * @returns Configuration as it is.
 */
export function defineButlerConfig(config: SafeButlerConfig): Partial<SafeButlerConfig> {
  return config
}

/**
 * Load user's configuration.
 *
 * @param options Config loading options.
 * @returns Configuration.
 */
export async function loadConfig(
  options?: RCOptions & LoadConfigOptions<Partial<ButlerConfig>>,
): Promise<Partial<ButlerConfig>> {
  const rc = readUserRc(options)
  const { config } = await _loadConfig<Partial<ButlerConfig>>(options)
  const defu = createDefu((_, key) => {
    // Ignore `config-provider.version` from `config`
    if (key === 'version') {
      return true
    }
    return false
  })
  const mergedConfig = defu(config, rc)
  return mergedConfig
}
