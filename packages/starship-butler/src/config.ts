import type { ConfigLayerMeta, LoadConfigOptions } from 'c12'
import type { ConfigProviderOptionsFromConfig } from 'starship-butler-config-provider'
import type { ButlerConfig } from './types'
import { loadConfig as loadConfigC12 } from 'c12'
import consola, { LogLevels } from 'consola'
import { createDefu } from 'defu'

/**
 * Type helper for define butler config.
 * @param config User config.
 * @returns User config as it is.
 */
export function defineButlerConfig(config: Partial<ButlerConfig<Partial<Omit<ConfigProviderOptionsFromConfig, 'version'>>>>): Partial<ButlerConfig<Partial<Omit<ConfigProviderOptionsFromConfig, 'version'>>>> {
  return config
}

/**
 * Loads the configuration for the butler using `c12`.
 * @returns The user configuration.
 */
export async function loadConfig<
  T extends ButlerConfig = ButlerConfig,
  MT extends ConfigLayerMeta = ConfigLayerMeta,
>(options?: LoadConfigOptions<T, MT>): Promise<ButlerConfig> {
  const merger = createDefu((obj, key) => {
    // Keep the version field, load from global rc file (Global rc file has the highest priority)
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
 * Merges user configuration with command line options.
 * @param config The user configuration loading from `c12`
 * @param packageName The package name, to identify which options in configuration should be used
 * @param options The command line options
 * @returns The merged options
 */
export function mergeOptions<T extends keyof ButlerConfig, R extends ButlerConfig[T]>(config: Partial<ButlerConfig>, packageName: T, options: R): typeof config[T] & R {
  const packageConfig = config[packageName]
  if (packageConfig?.verbose || options.verbose) {
    consola.level = LogLevels.debug
  }
  consola.debug('[starship-butler] Package config for "%s":', packageName, packageConfig)
  consola.debug('[starship-butler] Command line options:', options)
  if (options.version) {
    consola.warn('[starship-butler] Command line option "version" is ignored.')
  }
  delete options.version
  return { ...packageConfig, ...options }
}
