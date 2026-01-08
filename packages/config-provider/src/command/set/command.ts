import type { Nullable } from '@antfu/utils'
import type { SetOptions } from './types'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { upsertUserRc } from 'starship-butler-utils/config'
import consola from 'starship-butler-utils/consola'
import { ensureDirectory, isDirectory } from 'starship-butler-utils/fs'
import { basename, join } from 'starship-butler-utils/path'
import { isCancel, multiselect, select } from 'starship-butler-utils/prompts'
import { globSync } from 'tinyglobby'
import { version } from '../../../package.json'
import { processConfig } from '../../utils/config'
import { validateOptions } from './validate'

/**
 * Set matched configurations.
 *
 * @param sourcePattern Source glob pattern, relative to assets folder
 * @param target Target file or folder path
 * @param options Configuration and command line options
 */
export async function commandSet(
  sourcePattern: string,
  target: string,
  options: Partial<SetOptions>,
): Promise<void> {
  consola.debug(`[config-provider] Received source pattern: '${sourcePattern}', target: '${target}'`)
  consola.debug('[config-provider] Received set options:', options)

  if (!validateOptions(options)) {
    consola.debug('[config-provider] Invalid options detected, aborting configuration.')
    return
  }

  // Update the version of preset
  upsertUserRc({
    'config-provider': {
      version,
    },
  })

  /**
   * Assets folder path
   */
  const assetsPath = join(import.meta.dirname, '..', 'assets')
  consola.debug('[config-provider] Assets path:', assetsPath)

  // Create source glob pattern
  // If the pattern does not contain folder part, add '**/' prefix to match
  // files in all sub-folders, this is to improve user experience
  if (!sourcePattern.includes('/'))
    sourcePattern = `**/${sourcePattern}`
  consola.debug('[config-provider] Source pattern:', sourcePattern)
  // Read ignore patterns from .setignore file
  const ignorePatterns = readFileSync(join(assetsPath, '.setignore'), 'utf-8')
    ?.split('\n')
    .filter(line => line.trim() !== '') || []
  const matchedFiles = globSync(sourcePattern, {
    cwd: assetsPath,
    dot: true,
    ignore: ignorePatterns,
  })
  consola.debug('[config-provider] Matched files:', matchedFiles)

  // Check if target is a directory
  const isTargetDirectory = isDirectory(target)

  // Get source file
  /**
   * Source file paths, relative to assets folder
   */
  let sourceFiles: string[]
  if (!matchedFiles || matchedFiles.length === 0) {
    consola.error('No files matched the source pattern!')
    return
  }
  const selectOptions = matchedFiles.map(file => ({ label: file, value: file }))
  if (matchedFiles.length === 1) {
    sourceFiles = matchedFiles
  }
  else if (!isTargetDirectory) {
    const choice = await multiselect({
      message: 'Select a file to set up:',
      options: selectOptions,
    })
    if (isCancel(choice)) {
      consola.info('Operation cancelled by the user.')
      return
    }
    sourceFiles = choice
  }
  else {
    const choice = await select({
      message: 'Multiple files matched the source pattern, please select one to set up:',
      options: selectOptions,
    })
    if (isCancel(choice)) {
      consola.info('Operation cancelled by the user.')
      return
    }
    sourceFiles = [choice]
  }
  consola.debug('[config-provider] Selected source file:', sourceFiles.join(', '))

  // Infer target file path and ensure target folder exists
  const cwd = process.cwd()
  consola.debug('[config-provider] Current working directory:', cwd)

  for (const sourceFile of sourceFiles) {
    let targetFile: Nullable<string>
    if (isTargetDirectory) {
      ensureDirectory(target)
      targetFile = join(cwd, target, basename(sourceFile))
    }
    else {
      ensureDirectory(join(cwd, target))
      targetFile = join(cwd, target)
    }
    consola.debug('[config-provider] Target file path:', targetFile)
    processConfig(sourceFile, targetFile, options)
  }
}
