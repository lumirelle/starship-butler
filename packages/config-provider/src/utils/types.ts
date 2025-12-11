import type { BasicOptions } from 'starship-butler-types'

export interface ProcessConfigOptions extends BasicOptions {
  /**
   * Symlink or copy-paste configuration.
   *
   * CAUTION: STILL EXPERIMENTAL!
   *
   * @default 'copy-paste'
   */
  mode: 'copy-paste' | 'symlink'
  /**
   * Use glob pattern matching.
   *
   * WIP: Work in progress.
   *
   * @default false
   */
  useGlob: boolean
  /**
   * Preset application configurations forcibly, will override the existing
   * configuration with the same name.
   *
   * CAUTION: MAKE SURE YOU KNOW WHAT YOU ARE DOING!
   *
   * @default false
   */
  force: boolean
  /**
   * Dry run.
   *
   * @default false
   */
  dryRun: boolean
}
