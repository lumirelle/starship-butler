import type { Arrayable } from '@antfu/utils'
import type { ActionHandlerContext, ConfigPathGenerator, PlatformTargetFolderMap } from '../types'
import { platform } from 'node:os'
import { toArray } from '@antfu/utils'
import { ensureDirectory, exists } from 'starship-butler-utils/fs'
import { x } from 'tinyexec'
import { processConfig } from '../../../utils'

/* Target folder handler utilities */

/**
 * Create a target folder handler, which will return target folder based on platform.
 *
 * @param platformTargetFolderMap Platform to target folder map.
 * @returns Target folder handler.
 */
export function createTargetFolderHandler(
  platformTargetFolderMap: PlatformTargetFolderMap,
): (context: Omit<ActionHandlerContext, 'targetFolder'>) => string {
  return ({ systemOptions }) => {
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
  return path.every(t => exists(t))
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
  if (exists(directory))
    return true
  return ensureDirectory(directory)
}

/* ----- Handler utilities----- */

/**
 * Create a handler for given config path generators.
 *
 * @param configPathGenerators Config path generators.
 * @returns Handler function.
 */
export function createHandler(
  configPathGenerators: ConfigPathGenerator[],
): (context: ActionHandlerContext) => void {
  return (context: ActionHandlerContext) => {
    for (const generator of configPathGenerators) {
      const result = generator(context)
      if (!result)
        continue
      processConfig(result.source, result.target, context.options)
    }
  }
}
