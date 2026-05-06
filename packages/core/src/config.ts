import type { LoadConfigOptions, RCOptions } from 'starship-butler-utils/config'
import type { ButlerConfig, SafeButlerConfig } from './types'
import { createDefu } from 'defu'
import { loadConfig as _loadConfig, readUserConfig } from 'starship-butler-utils/config'

/**
 * Type helper for define butler's configuration.
 *
 * @param config Butler's configuration.
 * @returns Butler's configuration as it is.
 */
export function defineButlerConfig(config: SafeButlerConfig): SafeButlerConfig {
  return config
}

/**
 * Loads butler's fully resolved configuration.
 *
 * Default configuration file name is "butler", default user configuration file name is ".butlerrc".
 *
 * Additionally, this will ignore some fields (like `version`, ...) from configuration file, to let the user configuration be the only truth source.
 *
 * @param options Options for loading the configuration file. See {@link RCOptions} and {@link LoadConfigOptions}.
 * @returns The fully resolved configuration object, merged from configuration file and user configuration file.
 */
export async function loadConfig(
  options?: RCOptions & LoadConfigOptions<ButlerConfig>,
): Promise<ButlerConfig> {
  const userConfig = readUserConfig(options)
  const { config } = await _loadConfig<ButlerConfig>(options)
  const defu = createDefu((_, key) => {
    // Ignore `config-provider.version` from `config`
    if (key === 'version')
      return true
    return false
  })
  const mergedConfig = defu(config, userConfig)
  return mergedConfig
}
