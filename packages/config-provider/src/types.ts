import type { ConfigureSystemOptions } from './command/configure-system/types'
import type { ConfigureOptions } from './command/configure/types'

export interface ProcessConfigOptions {
  /**
   * Use glob pattern matching. WIP: Work in progress.
   * @default false
   */
  useGlob: boolean
  /**
   * Force overwrite existing files.
   * @default false
   */
  force: boolean
  /**
   * Mode.
   * @default 'copy'
   */
  mode: 'copy-paste' | 'symlink'
  /**
   * Dry run.
   * @default false
   */
  dryRun: boolean
}

export type ConfigProviderOptions = ConfigureSystemOptions
  & ConfigureOptions
  & {
    version: string
  }
