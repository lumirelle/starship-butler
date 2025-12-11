import type { ConfigLayerMeta, LoadConfigOptions } from 'c12'
import type { ConfigProviderOptions } from 'starship-butler-config-provider'
import { loadConfig as loadConfigC12 } from 'c12'
import { createDefu } from 'defu'

export interface ButlerConfig<ConfigProviderT extends Partial<ConfigProviderOptions> = Partial<ConfigProviderOptions>> {
  /**
   * Configuration for `config-provider` package.
   */
  'config-provider': ConfigProviderT
}

/**
 * Type helper for define butler config.
 *
 * @param config Configuration.
 * @returns Configuration as it is.
 */
export function defineButlerConfig(
  config: Partial<ButlerConfig<Partial<Omit<ConfigProviderOptions, 'version'>>>>,
): Partial<ButlerConfig<Partial<Omit<ConfigProviderOptions, 'version'>>>> {
  return config
}

/**
 * Loads the configuration using `c12`.
 *
 * @returns Configuration.
 */
export async function loadConfig<
  T extends ButlerConfig = ButlerConfig,
  MT extends ConfigLayerMeta = ConfigLayerMeta,
>(options?: LoadConfigOptions<T, MT>): Promise<ButlerConfig> {
  const merger = createDefu((obj, key) => {
    // Keep the version field first loaded
    // TODO: Make sure it loads from global rc file (Global rc file has the highest priority)
    if (obj[key] && key === 'version') {
      return true
    }
    return false
  })
  const { config = {} } = await loadConfigC12({
    name: 'butler',
    globalRc: true,
    // @ts-expect-error It should accept createDefu directly
    merger,
    ...(options || {}),
  })
  return Promise.resolve(config as ButlerConfig)
}
