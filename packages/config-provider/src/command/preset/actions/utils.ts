import type { Arrayable } from '@antfu/utils'
import { homedir as osHomedir, platform } from 'node:os'
import process from 'node:process'
import { toArray } from '@antfu/utils'
import consola from 'consola'
import { join } from 'pathe'
import { fs } from 'starship-butler-utils'
import { x } from 'tinyexec'
import { processConfig as _processConfig } from '../../../utils'

/**
 * Join all arguments together and normalize the resulting path, starting from home directory.
 *
 * @param paths Paths to join.
 * @returns Joined paths.
 * @throws {TypeError} if any of the path segments is not a string.
 */
export function homedir(...paths: string[]): string {
  return join(osHomedir(), ...paths)
}

/**
 * Join all arguments together and normalize the resulting path, starting from appdata directory.
 *
 * @param paths Paths to join.
 * @returns Joined paths.
 * @throws {TypeError} if any of the path segments is not a string.
 */
export function appdata(...paths: string[]): string {
  return join(process.env.APPDATA!, ...paths)
}

/**
 * Join all arguments together and normalize the resulting path, starting from local appdata directory.
 *
 * @param paths Paths to join.
 * @returns Joined paths.
 * @throws {TypeError} if any of the path segments is not a string.
 */
export function localAppdata(...paths: string[]): string {
  return join(process.env.LOCALAPPDATA!, ...paths)
}

/**
 * Check if path(s) exist and log warning if not exist.
 *
 * @param path Path(s).
 * @param customMessage Custom warning message.
 * @returns If path(s) exist.
 */
export function isPathExist(path: Arrayable<string>, customMessage?: string): boolean {
  path = toArray(path)
  if (path.length === 0) {
    return false
  }
  const isTargetExist = path.every(t => fs.exists(t))
  if (!isTargetExist) {
    consola.warn(customMessage ?? `Target ${path.join(', ')} ${path.length > 1 ? 'are' : 'is'} not found, please check your configuration!`)
  }
  return isTargetExist
}

/**
 * Check if path(s) exist in system's PATH environment variable and log warning if not exist.
 *
 * @param path Path(s).
 * @param customMessage Custom warning message.
 * @returns If path(s) exist in system's PATH environment variable.
 */
export async function isPathExistEnv(path: Arrayable<string>, customMessage?: string): Promise<boolean> {
  path = toArray(path)
  if (path.length === 0) {
    return false
  }
  try {
    const command = platform() === 'win32' ? 'where' : 'which'
    const results = await Promise.all(path.map(async t => (await x(command, [t])).stdout.trim() !== ''))
    const isTargetExist = results.every(t => t)
    if (!isTargetExist) {
      consola.warn(customMessage ?? `Target ${path.join(', ')} ${path.length > 1 ? 'are' : 'is'} not found, please check your configuration!`)
    }
    return isTargetExist
  }
  catch {
    consola.warn(customMessage ?? `Target ${path.join(', ')} ${path.length > 1 ? 'are' : 'is'} not found, please check your configuration!`)
    return false
  }
}

/**
 * Ensure if directory is exist and log warning if not exist.
 *
 * - If exist, return true.
 *
 * - If not exist, try to create it.
 *
 *   - If create success, return true.
 *
 *   - If create failed, return false.
 *
 * @param directory Directory path.
 * @param customMessage Custom warning message.
 * @returns If directory exists.
 */
export function ensureDirectoryExist(directory: string, customMessage?: string): boolean {
  if (!directory)
    return false
  if (fs.exists(directory))
    return true
  const isSuccess = fs.ensureDirectory(directory)
  if (!isSuccess)
    consola.warn(customMessage ?? `Directory ${directory} cannot be accessed or created, please check you permissions!`)
  return isSuccess
}

export const processConfig = _processConfig
