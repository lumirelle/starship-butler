import type { UserInputConfig } from 'c12'

/**
 * Merges user configuration with command line options.
 * @param config The user configuration loading from `c12`
 * @param options The command line options
 * @returns The merged options
 */
export function mergeOptions<T extends UserInputConfig, R extends UserInputConfig>(config: T, options: R): T & R {
  return { ...config, ...options }
}
