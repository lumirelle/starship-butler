import type { Arrayable } from '@antfu/utils'
import { toArray } from '@antfu/utils'
import consola from 'consola'
import { fs } from 'starship-butler-utils'

/**
 * Check system compatibility and log warning if not compatible.
 *
 * @param supportPlatforms Supported platforms.
 * @param platform current platform.
 * @param customMessage Custom warning message.
 * @returns If current platform is supported.
 */
export function checkPlatformSupport(
  supportPlatforms: NodeJS.Platform[],
  platform: NodeJS.Platform,
  customMessage?: string,
): boolean {
  const isSupportPlatform = supportPlatforms.includes(platform)
  if (!isSupportPlatform) {
    consola.warn(customMessage ?? `Just support ${supportPlatforms.join(', ')} platform now.`)
  }
  return isSupportPlatform
}

/**
 * Check if target folder/file is exist and log warning if not exist.
 *
 * If exist, return true.
 *
 * If not exist, return false.
 *
 * @param target Target path(s).
 * @param customMessage Custom warning message.
 * @returns If target folder/file exist.
 */
export function checkTargetExist(target: Arrayable<string>, customMessage?: string): boolean {
  target = toArray(target)
  if (target.length === 0) {
    return false
  }
  const isTargetExist = target.every(t => fs.existsSync(t))
  if (!isTargetExist) {
    consola.warn(customMessage ?? `Target ${target.join(', ')} ${target.length > 1 ? 'are' : 'is'} not exist, please check your configuration!`)
  }
  return isTargetExist
}

/**
 * Ensure if target folder is exist and log warning if not exist.
 *
 * If exist, return true.
 *
 * If not exist, try to create it.
 *
 * If create success, return true.
 *
 * If create failed, return false.
 *
 * @param targetFolder Target folder path.
 * @param customMessage Custom warning message.
 * @returns If target folder exist.
 */
export function ensureTargetFolderExist(targetFolder: string, customMessage?: string): boolean {
  if (!targetFolder) {
    return false
  }
  if (fs.existsSync(targetFolder)) {
    return true
  }
  const isTargetExist = fs.ensureDir(targetFolder)
  if (!isTargetExist) {
    consola.warn(customMessage ?? `Target directory ${targetFolder} is not accessible, please re-run as administrator!`)
  }
  return isTargetExist
}
