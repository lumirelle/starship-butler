import type {
  ConfigLayerMeta as _ConfigLayerMeta,
  LoadConfigOptions as _LoadConfigOptions,
  ResolvedConfig,
  UserInputConfig,
} from 'c12'
import { loadConfig as _loadConfig } from 'c12'

export type ConfigLayerMeta = _ConfigLayerMeta
export type LoadConfigOptions<
  T extends UserInputConfig = UserInputConfig,
  MT extends ConfigLayerMeta = ConfigLayerMeta,
> = _LoadConfigOptions<T, MT>

/**
 * Loads the configuration using `c12`.
 *
 * Default config file name is "butler" and rc file loading is disabled.
 *
 * @param options Load config options.
 * @returns Configuration.
 */
export function loadConfig<
  M extends UserInputConfig = UserInputConfig,
  MT extends ConfigLayerMeta = ConfigLayerMeta,
>(options?: LoadConfigOptions<M, MT>): Promise<ResolvedConfig<M, MT>> {
  return _loadConfig({
    name: 'butler',
    rcFile: false,
    ...options,
  })
}
