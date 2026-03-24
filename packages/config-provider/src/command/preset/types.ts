import type { Arrayable } from '@antfu/utils'
import type { ProcessConfigOptions } from '../utils'

export type * from './actions/types'

/**
 * (Configuration and Command-line) Options for preset command.
 */
export interface PresetOptions extends ProcessConfigOptions {
  /**
   * Presets that you want to include, accepts JavaScript regex pattern string(s).
   *
   * @default undefined
   */
  include: Arrayable<string>
  /**
   * Presets that you want to exclude (apply on included presets), accepts JavaScript regex pattern string(s).
   *
   * @default undefined
   */
  exclude: Arrayable<string>
  /**
   * Applying all presets, overrides `include` and `exclude` options with `[*]` and `[]` whatever they are provided.
   *
   * @default false
   */
  all: boolean
}
