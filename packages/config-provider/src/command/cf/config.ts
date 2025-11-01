import type { ProcessConfigOptions } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { fs, highlight } from 'starship-butler-utils'

/**
 * Process config files (copy-paste or symlink).
 *
 * @param source Relative path to assets folder (package-root/assets/).
 * @param target Target path.
 * @param options Processing options.
 * @returns Whether operation success or not.
 */
export async function processConfig(
  source: string,
  target: string,
  options: Partial<ProcessConfigOptions> = {},
): Promise<void> {
  const { mode = 'copy-paste', dryRun = false } = options
  if (mode === 'copy-paste') {
    if (dryRun || await _copyPasteConfig(source, target, options)) {
      consola.success(
        `Configuration ${highlight.important(`"${source}"`)} ${
          dryRun ? highlight.green('will') : 'is'
        } copied to ${highlight.important(`"${target}"`)}.`,
      )
    }
  }
  else if (mode === 'symlink') {
    if (dryRun || await _symlinkConfig(source, target, options)) {
      consola.success(`Configuration ${highlight.important(`"${target}"`)} ${
        dryRun ? highlight.green('will') : 'is'
      } symlinked to ${highlight.important(`"${source}"`)}.`)
    }
  }
  else {
    throw new Error(`Unknown configure mode: ${mode}`)
  }
}

/**
 * Copy config to target path.
 *
 * @private
 * @param source Relative path to assets folder (`package-root/assets/`).
 * @param target Target path, absolute path or relative path to CWD.
 * @returns Whether operation success or not.
 */
async function _copyPasteConfig(
  source: string,
  target: string,
  options: Omit<Partial<ProcessConfigOptions>, 'mode'> = {},
): Promise<boolean> {
  const { useGlob, force } = options
  if (useGlob) {
    // TODO: Implement support for glob
    return Promise.resolve(false)
  }
  return Promise.resolve(
    fs.copyFile(
      join(import.meta.dirname, '..', 'assets', source),
      target,
      force,
    ),
  )
}

/**
 * Symlink config to target path.
 *
 * @private
 * @param source Relative path to assets folder (`package-root/assets/`).
 * @param target Target path, absolute path or relative path to CWD.
 * @returns Whether operation success or not.
 */
async function _symlinkConfig(
  source: string,
  target: string,
  options: Omit<Partial<ProcessConfigOptions>, 'mode'> = {},
): Promise<boolean> {
  const { useGlob, force } = options
  if (useGlob) {
    // TODO: Implement support for glob
    return Promise.resolve(false)
  }
  return fs.createSymlink(
    join(import.meta.dirname, '..', 'assets', source),
    target,
    force,
  )
}
