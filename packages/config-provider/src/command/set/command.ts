import type { Nullable } from '@antfu/utils'
import type { SetOptions } from './types'
import process from 'node:process'
import { isCancel, multiselect } from '@clack/prompts'
import consola from 'consola'
import { basename, join } from 'pathe'
import { fs } from 'starship-butler-utils'
import { globSync } from 'tinyglobby'
import { processConfig } from '../../utils/config'
import { validateOptions } from './validate'

/**
 * Set matched configurations.
 *
 * @param sourcePattern Source glob pattern, relative to assets folder
 * @param target Target file or folder path
 * @param options Configuration and command line options
 */
export async function set(
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
  const matchedFiles = globSync(sourcePattern, {
    cwd: assetsPath,
    dot: true,
  })
  consola.debug('[config-provider] Matched files:', matchedFiles)

  // Get source file
  /**
   * Source file paths, relative to assets folder
   */
  let sourceFiles: string[]
  if (matchedFiles.length > 1) {
    const choice = await multiselect({
      message: 'Select a file to set up:',
      options: matchedFiles.map(file => ({ label: file, value: file })),
    })
    if (isCancel(choice)) {
      consola.info('Operation cancelled by the user.')
      process.exit(0)
    }
    sourceFiles = choice
  }
  else if (matchedFiles.length === 1) {
    sourceFiles = matchedFiles
  }
  else {
    consola.error('No files matched the source pattern!')
    return
  }
  consola.debug('[config-provider] Selected source file:', sourceFiles.join(', '))

  // Infer target file path and ensure target folder exists
  const cwd = process.cwd()
  consola.debug('[config-provider] Current working directory:', cwd)

  for (const sourceFile of sourceFiles) {
    let targetFile: Nullable<string>
    if (fs.isDirectory(target)) {
      fs.ensureDirectory(target)
      targetFile = join(cwd, target, basename(sourceFile))
    }
    else {
      fs.ensureDirectory(join(cwd, target))
      targetFile = join(cwd, target)
    }
    consola.debug('[config-provider] Target file path:', targetFile)
    processConfig(sourceFile, targetFile, options)
  }
}
