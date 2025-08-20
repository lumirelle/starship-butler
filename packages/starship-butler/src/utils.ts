import type { ConfigLayerMeta, LoadConfigOptions } from 'c12'
import type { ButlerConfig } from './types'
import { loadConfig as loadConfigC12 } from 'c12'
import consola, { LogLevels } from 'consola'

/**
 * Type helper for define butler config.
 * @param config User config.
 * @returns User config as it is.
 */
export function defineButlerConfig(config: Partial<ButlerConfig>): Partial<ButlerConfig> {
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
  const { config = {} } = await loadConfigC12({
    name: 'butler',
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
  return { ...packageConfig, ...options }
}
