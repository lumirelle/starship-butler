import type { OptionsBasic } from 'starship-butler-types'
import path from 'node:path'
import process from 'node:process'
import consola from 'consola'
import { globSync } from 'tinyglobby'

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
 * @param category
 * Category of the configuration, optional. Default is `''`.
 * This option will be transformed to fit glob pattern:
 * - If category is `*`, will replace it with `**`
 * - Otherwise, will transform it to `{category}/**`
 * @param source Source path
 * @param target Target path, Default is current working directory
 * @param options Configuration and command line options
 */
export async function settingUp(category: string | undefined, source: string, target: string | undefined, options: Partial<SetOptions>): Promise<void> {
  // WIP: Setting up locally
  consola.debug('[starship-butler] Setting up locally with category:', category, ', source:', source, ', target:', target, 'and options:', options)

  const assetsPath = path.join(import.meta.dirname, '..', 'assets')
  consola.debug('[starship-butler] Assets path:', assetsPath)

  // Default values
  if (!category) {
    category = ''
  }
  // If category is `*`, will replace it with `**` to fit glob pattern
  else if (category === '*') {
    category = '**/'
  }
  // Transform category to fit glob pattern
  else {
    category = `${category}/**/`
  }

  const sourcePattern = `${category}${source}`
  consola.debug('[starship-butler] Source pattern:', sourcePattern)
  const matchedFiles = globSync(sourcePattern, {
    cwd: assetsPath,
    dot: true,
  })
  consola.debug('[starship-butler] Matched files:', matchedFiles)

  if (!target) {
    target = process.cwd()
    consola.debug('[starship-butler] Target not specified, using current working directory:', target)
  }
}
