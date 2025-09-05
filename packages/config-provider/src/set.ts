import type { OptionsBasic } from 'starship-butler-types'
import consola from 'consola'

/**
 * Options for command `set`.
 */
export interface SetOptions extends OptionsBasic {
  /**
   * Run actions forcedly, if you don't specify include or exclude options and force is true, this will recognized as fully configuring.
   * The version executed will be recorded in global rc file.
   * The next time the user runs the configure command, the recorded version will be used to determine if a full update is needed.
   * You can change the behavior by option `enableFullUpdate`.
   * @default false
   * @see enableFullUpdate
   */
  force: boolean
  /**
   * Use symlink instead of copy
   * @default false
   */
  symlink: boolean
}

/**
 * Configuration options for command `set`.
 */
export type SetOptionsFromConfig = Omit<SetOptions, 'force' | 'symlink'>

/**
 * Command line options for command `set`.
 */
export interface SetOptionsFromCommandLine extends SetOptions {}

/**
 * Setting up locally.
 * @param source Source path
 * @param target Target path
 * @param options Configuration and command line options
 */
export async function settingUp(source: string, target: string, options: Partial<SetOptions>): Promise<void> {
  // WIP: Setting up locally
  consola.debug('[starship-butler] Setting up locally with source:', source, ', target:', target, 'and options:', options)
}
