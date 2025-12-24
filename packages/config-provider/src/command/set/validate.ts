import type { SetOptions } from './types'
import consola from 'starship-butler-utils/consola'

export function validateOptions(options: Partial<SetOptions>): boolean {
  if (options.mode && !['copy-paste', 'symlink'].includes(options.mode)) {
    consola.error(`Invalid mode "${options.mode}" detected, only "copy-paste" and "symlink" are allowed.`)
    return false
  }

  return true
}
