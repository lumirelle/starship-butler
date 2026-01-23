import type { PresetOptions } from './types'
import consola from 'consola'

export function validateOptions(options: Partial<PresetOptions>): boolean {
  if (options.mode && !['copy-paste', 'symlink'].includes(options.mode)) {
    consola.error(`Unknown mode "${options.mode}", expected "copy-paste" or "symlink"!`)
    return false
  }
  return true
}
