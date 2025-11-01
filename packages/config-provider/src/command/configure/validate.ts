import type { ConfigureOptions } from './types'
import consola from 'consola'

export function validateOptions(options: Partial<ConfigureOptions>): boolean {
  if (options.mode && !['copy-paste', 'symlink'].includes(options.mode)) {
    consola.error(`Invalid mode "${options.mode}" detected, only "copy-paste" and "symlink" are allowed.`)
    return false
  }

  return true
}
