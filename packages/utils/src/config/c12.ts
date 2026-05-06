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

const DEFAULT_NAME = 'butler'

/**
 * Loads a configuration file with [priority](https://github.com/unjs/c12#loading-priority), supporting multiple formats and locations, powered by [c12](https://github.com/unjs/c12).
 *
 * Default configuration file name is "butler", and this will ignore RC file by default.
 *
 * @param options Options for loading the configuration file. See {@link LoadConfigOptions}.
 * @returns The merged configuration object.
 */
export function loadConfig<
  M extends UserInputConfig = UserInputConfig,
  MT extends ConfigLayerMeta = ConfigLayerMeta,
>(options?: LoadConfigOptions<M, MT>): Promise<ResolvedConfig<M, MT>> {
  return _loadConfig({
    name: DEFAULT_NAME,
    rcFile: false,
    ...options,
  })
}
