import type { UserInputConfig } from 'c12'

export function mergeOptions<T extends UserInputConfig, R extends UserInputConfig>(config: T, options: R): T & R {
  return { ...config, ...options }
}
