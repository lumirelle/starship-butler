import { join } from 'node:path'
import { fs } from 'starship-butler-utils'

/**
 * Copy config to target path
 * @param source Relative path to assets folder (`package-root/assets/`)
 * @param target Target path, absolute path or relative path to CWD
 * @returns Operation success
 */
export function copyConfig(source: string, target: string, options?: { useGlob?: boolean, force?: boolean }): boolean {
  if (options?.useGlob) {
    // TODO: Implement support for glob
    return false
  }
  return fs.copyFile(join(import.meta.dirname, '..', 'assets', source), target, options?.force)
}

/**
 * Symlink config to target path
 * @param source Relative path to assets folder (`package-root/assets/`)
 * @param target Target path, absolute path or relative path to CWD
 * @returns Operation success
 */
export function symlinkConfig(source: string, target: string, options?: { useGlob?: boolean, force?: boolean }): Promise<boolean> {
  if (options?.useGlob) {
    // TODO: Implement support for glob
    return Promise.resolve(false)
  }
  return fs.createSymlink(join(import.meta.dirname, '..', 'assets', source), target, options?.force)
}
