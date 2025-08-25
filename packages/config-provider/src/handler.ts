import type { ProcessConfigOptions } from './types'
import { join } from 'node:path'
import consola from 'consola'
import { fs, highlight } from 'starship-butler-utils'

/**
 * Process config files (Copy or symlink)
 * @param source Source path
 * @param target Target path
 * @param options Processing options
 * @returns Operation success
 */
export async function processConfig(source: string, target: string, options: Partial<ProcessConfigOptions> = {}): Promise<void> {
  const { mode = 'copy' } = options
  delete options.mode
  if (mode === 'copy') {
    if (await copyConfig(source, target, options)) {
      consola.success(`Config file ${highlight.important(`"${source}"`)} copied to ${highlight.important(`"${target}"`)}.`)
    }
  }
  else if (mode === 'symlink') {
    if (await symlinkConfig(source, target, options)) {
      consola.success(`Config file ${highlight.important(`"${source}"`)} symlinked to ${highlight.important(`"${target}"`)}.`)
    }
  }
}

/**
 * Copy config to target path
 * @param source Relative path to assets folder (`package-root/assets/`)
 * @param target Target path, absolute path or relative path to CWD
 * @returns Operation success
 */
export async function copyConfig(source: string, target: string, options: Omit<Partial<ProcessConfigOptions>, 'mode'> = {}): Promise<boolean> {
  const { useGlob, force } = options
  if (useGlob) {
    // TODO: Implement support for glob
    return Promise.resolve(false)
  }
  return Promise.resolve(fs.copyFile(join(import.meta.dirname, '..', 'assets', source), target, force))
}

/**
 * Symlink config to target path
 * @param source Relative path to assets folder (`package-root/assets/`)
 * @param target Target path, absolute path or relative path to CWD
 * @returns Operation success
 */
export async function symlinkConfig(source: string, target: string, options: Omit<Partial<ProcessConfigOptions>, 'mode'> = {}): Promise<boolean> {
  const { useGlob, force } = options
  if (useGlob) {
    // TODO: Implement support for glob
    return Promise.resolve(false)
  }
  return fs.createSymlink(join(import.meta.dirname, '..', 'assets', source), target, force)
}
