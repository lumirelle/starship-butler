import type { ProcessConfigOptions } from './types'
import { consola } from 'consola'
import { join } from 'pathe'
import { copyFile, createSymlink } from 'starship-butler-utils/fs'
import { important, success } from 'starship-butler-utils/highlight'
import { ASSETS_FOLDER } from '../../constants'

/**
 * Copy config to target path.
 *
 * @private
 * @param source Relative path to assets folder (`package-root/assets/`).
 * @param target Target path, absolute path or relative path to CWD.
 * @param options Processing options.
 * @returns Whether operation success or not.
 */
function _copyPasteConfig(
  source: string,
  target: string,
  options: Omit<Partial<ProcessConfigOptions>, 'mode'> = {},
): boolean {
  const { useGlob, force } = options
  if (useGlob) {
    // TODO: Implement support for glob
    return false
  }
  return copyFile(join(ASSETS_FOLDER, source), target, force)
}

/**
 * Symlink config to target path.
 *
 * @private
 * @param source Relative path to assets folder (`package-root/assets/`).
 * @param target Target path, absolute path or relative path to CWD.
 * @param options Processing options.
 * @returns Whether operation success or not.
 */
function _symlinkConfig(
  source: string,
  target: string,
  options: Omit<Partial<ProcessConfigOptions>, 'mode'> = {},
): boolean {
  const { useGlob, force } = options
  if (useGlob) {
    // TODO: Implement support for glob
    return false
  }
  return createSymlink(join(ASSETS_FOLDER, source), target, force)
}

/**
 * Process config files (copy-paste or symlink).
 *
 * @param source Relative path to assets folder (package-root/assets/).
 * @param target Target path.
 * @param options Processing options.
 */
export function processConfig(
  source: string,
  target: string,
  options: Partial<ProcessConfigOptions> = {},
): void {
  const { mode = 'copy-paste', dryRun = false } = options
  if ((mode === 'copy-paste' && dryRun) || _copyPasteConfig(source, target, options)) {
    consola.success(
      `Configuration ${important(source)} ${
        dryRun ? success('will') : 'is'
      } copied to ${important(target)}.`,
    )
  }
  else if (dryRun || _symlinkConfig(source, target, options)) {
    consola.success(
      `Configuration ${important(target)} ${
        dryRun ? success('will') : 'is'
      } symlinked to ${important(source)}.`,
    )
  }
}
