import type { ConfigLayerMeta, LoadConfigOptions, UserInputConfig } from 'c12'
import type { ButlerConfig } from './types'
import { loadConfig as loadConfigC12 } from 'c12'
import consola, { LogLevels } from 'consola'

/**
 * Merges user configuration with command line options.
 * @param config The user configuration loading from `c12`
 * @param packageName The package name, to identify which options in configuration should be used
 * @param options The command line options
 * @returns The merged options
 */
export function mergeOptions<
  T extends UserInputConfig,
  R extends UserInputConfig,
>(config: T, packageName: keyof ButlerConfig, options: R): T & R {
  const packageConfig = config[packageName] ? config[packageName] : {}
  if (packageConfig.verbose || options.verbose) {
    consola.level = LogLevels.debug
  }
  consola.debug('[starship-butler] Package config for "%s":', packageName, packageConfig)
  consola.debug('[starship-butler] Command line options:', options)
  return { ...packageConfig, ...options }
}

/**
 * Type helper for define butler config.
 * @param config User config.
 * @returns User config as it is.
 */
export function defineButlerConfig(config: ButlerConfig): ButlerConfig {
  return config
}

/**
 * Loads the configuration for the butler using `c12`.
 * @returns The user configuration.
 */
export async function loadConfig<
  T extends UserInputConfig = UserInputConfig,
  MT extends ConfigLayerMeta = ConfigLayerMeta,
>(options?: LoadConfigOptions<T, MT>): Promise<UserInputConfig> {
  const { config } = await loadConfigC12({
    name: 'butler',
    ...(options || {}),
  })
  return config
}
