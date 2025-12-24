import type { Arrayable } from '@antfu/utils'
import type { ConfigPathGenerator, PlatformTargetFolderMap } from '../types'
import { homedir as osHomedir, platform } from 'node:os'
import process from 'node:process'
import { toArray } from '@antfu/utils'
import { join } from 'pathe'
import { fs } from 'starship-butler-utils'
import { x } from 'tinyexec'
import { processConfig } from '../../../utils'

/* ----- Path definition utilities ----- */

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

/* Target folder handler utilities */

/**
 * Create a target folder handler, which will return target folder based on platform.
 *
 * @param platformTargetFolderMap Platform to target folder map.
 * @returns Target folder handler.
 */
export function createTargetFolderHandler(platformTargetFolderMap: PlatformTargetFolderMap) {
  return ({ systemOptions }: { systemOptions: { platform: NodeJS.Platform } }) => {
    const { platform } = systemOptions
    return platformTargetFolderMap[platform] ?? ''
  }
}

/* ----- Prehandler utilities ----- */

/**
 * Check if path(s) exist and log warning if not exist.
 *
 * @param path Path(s).
 * @returns If path(s) exist.
 */
export function isPathExist(path: Arrayable<string>): boolean {
  path = toArray(path)
  if (path.length === 0) {
    return false
  }
  return path.every(t => fs.exists(t))
}

/**
 * Check if path(s) exist in system's PATH environment variable and log warning if not exist.
 *
 * @param path Path(s).
 * @returns If path(s) exist in system's PATH environment variable.
 */
export async function isPathExistEnv(path: Arrayable<string>): Promise<boolean> {
  path = toArray(path)
  if (path.length === 0) {
    return false
  }
  try {
    const command = platform() === 'win32' ? 'where' : 'which'
    const results = await Promise.all(path.map(async t => (await x(command, [t])).stdout.trim() !== ''))
    return results.every(t => t)
  }
  catch {
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
 * @returns If directory exists.
 */
export function ensureDirectoryExist(directory: string): boolean {
  if (!directory)
    return false
  if (fs.exists(directory))
    return true
  return fs.ensureDirectory(directory)
}

/* ----- Handler utilities----- */

/**
 * Create a handler for given config path generators.
 *
 * @param configPathGenerators Config path generators.
 * @returns Handler function.
 */
export function createHandler(configPathGenerators: ConfigPathGenerator[]) {
  return async ({ options, targetFolder }: { options: Partial<any>, targetFolder: string }) => {
    for (const generator of configPathGenerators) {
      const { source, target } = generator(targetFolder)
      await processConfig(source, target, options)
    }
  }
}
