import type { BasicOptions } from 'starship-butler-types'

/**
 * Options to configure locally for both configuration & command line interface.
 */
export interface ConfigureOptions extends BasicOptions {
  /**
   * Run configuring actions forcedly, will override the existing configuration with the same name.
   *
   * @default false
   */
  force: boolean
  /**
   * Symlink or copy-paste configuration.
   *
   * CAUTION: Symlink mode is experimental now.
   *
   * @default 'copy-paste'
   */
  mode: 'copy-paste' | 'symlink'
}
