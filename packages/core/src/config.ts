import type { ConfigLayerMeta, LoadConfigOptions, UserInputConfig } from 'c12'
import type { ConfigProviderOptionsFromConfig } from 'starship-butler-config-provider'
import { loadConfig as loadConfigC12 } from 'c12'
import consola from 'consola'
import { createDefu } from 'defu'

export interface ButlerConfig<ConfigProviderT extends Partial<ConfigProviderOptionsFromConfig> = Partial<ConfigProviderOptionsFromConfig>> {
  'config-provider': ConfigProviderT
}

/**
 * Type helper for define butler config
 * @param config Configuration
 * @returns Configuration as it is
 */
export function defineButlerConfig(config: Partial<ButlerConfig<Partial<Omit<ConfigProviderOptionsFromConfig, 'version'>>>>): Partial<ButlerConfig<Partial<Omit<ConfigProviderOptionsFromConfig, 'version'>>>> {
  return config
}

/**
 * Loads the configuration using `c12`
 * @returns Configuration
 */
export async function loadConfig<
  T extends ButlerConfig = ButlerConfig,
  MT extends ConfigLayerMeta = ConfigLayerMeta,
>(options?: LoadConfigOptions<T, MT>): Promise<ButlerConfig> {
  const merger = createDefu((obj, key) => {
    // Keep the version field first loaded
    // FIXME: Make sure it loads from global rc file (Global rc file has the highest priority)
    if (obj[key] && key === 'version') {
      return true
    }
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

/**
 * Merges configuration options with command line options
 * @param configOptions The configuration options
 * @param clOptions The command line options
 * @returns The merged options
 */
export function mergeOptions<T extends UserInputConfig = UserInputConfig, U extends UserInputConfig = UserInputConfig>(configOptions: T, clOptions: U): T & U {
  consola.debug('[starship-butler] Configuration options:', configOptions)
  consola.debug('[starship-butler] Command line options:', clOptions)
  return { ...configOptions, ...clOptions }
}
