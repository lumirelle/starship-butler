import type { Arrayable } from '@antfu/utils'
import type { ConfigureOptions } from './types'
import path from 'node:path'
import process from 'node:process'
import { toArray } from '@antfu/utils'
import { isCancel, select } from '@clack/prompts'
import consola from 'consola'
import { fs } from 'starship-butler-utils'
import { globSync } from 'tinyglobby'
import { processConfig } from '../config'

/**
 * Configure locally. If source pattern matches multiple files, user will be prompted to select one.
 *
 * @param sourcePattern Source glob pattern(s), relative to assets folder
 * @param target Target file or folder path
 * @param options Configuration and command line options
 */
export async function configure(sourcePattern: Arrayable<string>, target: string, options: Partial<ConfigureOptions>): Promise<void> {
  sourcePattern = toArray(sourcePattern)
  consola.debug(`[starship-butler] Configure locally with source: '${sourcePattern.join(',')}', target: '${target}'`)
  consola.debug('[config-provider] Configure locally with options:', options)

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
  if (matchedFiles.length > 1) {
    const choice = await select({
      message: 'Select a file to set up:',
      options: matchedFiles.map(file => ({ label: file, value: file })),
    })
    if (isCancel(choice)) {
      consola.info('[starship-butler] Operation cancelled by the user.')
      process.exit(0)
    }
    sourceFile = choice as string
  }
  else if (matchedFiles.length === 1) {
    sourceFile = matchedFiles[0]!
  }
  else {
    consola.error('No files matched the source pattern!')
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

  processConfig(sourceFile, targetFile, options)
}
