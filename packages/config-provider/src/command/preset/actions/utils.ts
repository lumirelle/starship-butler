import type { Arrayable } from '@antfu/utils'
import type { RC, RCOptions } from 'starship-butler-utils/config'
import type { ActionHandler, ConfigPathGenerator, DestinationHandler, PlatformDestinationMap } from './types'
import { platform } from 'node:os'
import process from 'node:process'
import { toArray } from '@antfu/utils'
import { join } from 'pathe'
import { ensureDirectory, exists } from 'starship-butler-utils/fs'
import { x } from 'tinyexec'
import { readUserRc as _readUserRc, upsertUserRc as _upsertUserRc, processConfig } from '../../utils'

/* Rc9 utilities */

/**
 * Updates or creates a user rc file, within `config-provider.preset` field (rc file under home directory).
 *
 * Default rc file name is ".butlerrc".
 *
 * @param config The config to upsert to the `config-provider.preset` field of rc file.
 * @param options Options for rc9.
 */
export function upsertUserRc(config: RC, options?: RCOptions): void {
  return _upsertUserRc({
    preset: config,
  }, options)
}

/**
 * Reads the `config-provider.preset` field from the user rc file (rc file under home directory).
 *
 * Default rc file name is ".butlerrc".
 *
 * @param options Options for rc9.
 * @returns The `config-provider.preset` field from the rc content.
 */
export function readUserRc(options?: RCOptions): RC {
  return _readUserRc(options)?.preset ?? {}
}

/* Destination handler utilities */

/**
 * Create a destination handler, which will return destination based on platform.
 *
 * @param map Platform to destination map.
 * @returns Destination handler.
 */
export function createDestinationHandler(
  map: PlatformDestinationMap,
): DestinationHandler {
  return () => map[process.platform]
}

/**
 * Create a prehandler to check if destination exist, or throw an error.
 */
export function createPrehandler(type: 'destination-exist'): ActionHandler
/**
 * Create a prehandler to check if executable exist in system environment, and ensure the destination folder exist or can be created, or throw an error.
 */
export function createPrehandler(type: 'env-exist', options: { executable: string }): ActionHandler
export function createPrehandler(type: 'destination-exist' | 'env-exist', options?: { executable: string }): ActionHandler {
  if (type === 'destination-exist') {
    return async ({ destination, name }) => {
      if (!isPathExist(destination))
        throw new Error(`Destination path ${destination} does not exist. You may need to install ${name} first!`)
    }
  }
  else if (type === 'env-exist' && options?.executable) {
    return async ({ destination, name }) => {
      if (!(await isPathExistEnv(options.executable)))
        throw new Error(`You should install ${name} first and add it to your system's PATH environment variable!`)
      if (!ensureDirectoryExist(destination))
        throw new Error(`Failed to create destination folder: ${destination}`)
    }
  }
  else {
    return () => {}
  }
}

/* Prehandler utilities */

/**
 * Check if path(s) exist.
 *
 * @param path Path(s).
 * @returns If path(s) exist.
 */
export function isPathExist(path: Arrayable<string>): boolean {
  const paths = toArray(path)
  if (paths.length === 0)
    return false
  return paths.every(t => exists(t))
}

/**
 * Check if path(s) exist in system environment.
 *
 * @param path Path(s).
 * @returns If path(s) exist in system environment variable.
 */
export async function isPathExistEnv(path: Arrayable<string>): Promise<boolean> {
  const paths = toArray(path)
  if (paths.length === 0)
    return false
  try {
    const command = platform() === 'win32' ? 'where' : 'which'
    const results = await Promise.all(
      paths.map(async t => (await x(command, [t])).stdout.trim() !== ''),
    )
    return results.every(Boolean)
  }
  catch {
    return false
  }
}

/**
 * Ensure if directory is exist.
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
  if (!directory) {
    return false
  }
  if (exists(directory)) {
    return true
  }
  return ensureDirectory(directory)
}

/* Handler utilities */

/**
 * Create a basic config path generator with given source and (optional) target file name.
 * @param sourceName Source file name in the action's base folder.
 * @param targetName Target file name in the destination folder, if not provided, it will be the same as sourceName.
 * @returns Config path generator.
 */
export function createConfigPathGenerator(sourceName: string, targetName?: string): ConfigPathGenerator {
  return ({ destination, base }) => ({
    source: join(base, sourceName),
    target: join(destination, targetName ?? sourceName),
  })
}

/**
 * Create a handler for given config path generators.
 *
 * @param generators Config path generators.
 * @returns Handler function.
 */
export function createHandler(
  generators: (ConfigPathGenerator | false | null | undefined)[],
): ActionHandler {
  const filteredGenerators = generators.filter(Boolean) as ConfigPathGenerator[]
  return (context) => {
    for (const generator of filteredGenerators) {
      const result = generator(context)
      if (!result)
        continue
      processConfig(result.source, result.target, context.options)
    }
  }
}
