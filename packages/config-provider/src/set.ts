import type { OptionsBasic } from 'starship-butler-types'
import path from 'node:path'
import process from 'node:process'
import prompts from '@posva/prompts'
import consola from 'consola'
import { fs } from 'starship-butler-utils'
import { globSync } from 'tinyglobby'
import { processConfig } from './handler'

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
 * @param sourcePattern Source glob pattern, relative to assets folder
 * @param target Target file or folder path
 * Category of the configuration, default is `''`.
 * This option will be transformed to fit glob pattern:
 * - If category is `*`, will replace it with `**`
 * - Otherwise, will transform it to `{category}/**`
 * @param options Configuration and command line options
 */
export async function settingUp(sourcePattern: string, target: string, options: Partial<SetOptions>): Promise<void> {
  consola.debug(`[starship-butler] Setting up locally with source: '${sourcePattern}', target: '${target}'`)
  consola.debug('[config-provider] Setting up locally with options:', options)

  /**
   * Assets folder path
   */
  const assetsPath = path.join(import.meta.dirname, '..', 'assets')
  consola.debug('[starship-butler] Assets path:', assetsPath)

  // Create source glob pattern
  consola.debug('[starship-butler] Source pattern:', sourcePattern)
  const matchedFiles = globSync(sourcePattern, {
    cwd: assetsPath,
    dot: true,
  })
  consola.debug('[starship-butler] Matched files:', matchedFiles)

  // Get source file
  /**
   * Source file path, relative to assets folder
   */
  let sourceFile: string | undefined
  let cancelled = false
  if (matchedFiles.length > 1) {
    const { choice } = await prompts({
      type: 'autocomplete', // FIXME: 'autocomplete' has a bug with escape key, see: https://github.com/terkelg/prompts/issues/362
      name: 'choice',
      message: 'Select a file to set up:',
      choices: matchedFiles.map(file => ({ title: file, value: file })),
    }, {
      onCancel: () => cancelled = true,
    })
    sourceFile = choice as string
  }
  else if (matchedFiles.length === 1) {
    sourceFile = matchedFiles[0]
  }
  else {
    consola.error('No files matched the source pattern!')
    return
  }

  if (cancelled) {
    consola.info('[starship-butler] Operation cancelled by the user.')
    return
  }
  consola.debug('[starship-butler] Selected source file:', sourceFile)

  // Infer target file path and ensure target folder exists
  const cwd = process.cwd()
  consola.debug('[starship-butler] Current working directory:', cwd)
  let targetFile: string | undefined
  if (fs.isDirectory(target)) {
    fs.ensureDir(target)
    targetFile = path.join(cwd, target, path.basename(sourceFile))
  }
  else {
    fs.ensureDir(path.dirname(target))
    targetFile = path.join(cwd, target)
  }
  consola.debug('[starship-butler] Target file path:', targetFile)

  const { force = false, symlink = false, dryRun = false } = options
  const mode = symlink ? 'symlink' : 'copy'
  processConfig(sourceFile, targetFile, { force, mode, dryRun })
}
