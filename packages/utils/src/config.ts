import type { ConfigLayerMeta, LoadConfigOptions, ResolvedConfig, UserInputConfig } from 'c12'
import { loadConfig as _loadConfig } from 'c12'
import { readUser, updateUser, writeUser } from 'rc9'
import { remove } from './fs'
import { homedir } from './path'

/* ----- rc9 ----- */

const RC_FILE_NAME = '.butlerrc'

export type RCOptions = typeof import('rc9').defaults

/**
 * Reads the user rc file (rc file under home directory).
 *
 * Default rc file name is ".butlerrc".
 *
 * @param options Options for rc9.
 * @returns The rc content.
 */
export function readUserRc<RC extends Record<string, any>>(options?: RCOptions): RC {
  return readUser<RC>({
    name: RC_FILE_NAME,
    ...options,
  })
}

/**
 * Writes a user rc file (rc file under home directory).
 *
 * Default rc file name is ".butlerrc".
 *
 * @param config The config to be written to rc file.
 * @param options Options for rc9.
 */
export function writeUserRc(config: any, options?: RCOptions): void {
  writeUser(config, {
    name: RC_FILE_NAME,
    ...options,
  })
}

/**
 * Updates a user rc file (rc file under home directory).
 *
 * Default rc file name is ".butlerrc".
 *
 * @param config The config to update the rc file.
 * @param options Options for rc9.
 * @returns The updated rc content.
 */
export function updateUserRc(config: any, options?: RCOptions): any {
  return updateUser(config, {
    name: RC_FILE_NAME,
    ...options,
  })
}

/**
 * Removes the user rc file (rc file under home directory).
 *
 * Default rc file name is ".butlerrc".
 *
 * @param options Options for rc9.
 */
export function removeUserRc(options?: RCOptions): void {
  const { dir, name = RC_FILE_NAME } = options ?? {}
  const rcPath = dir ? `${dir}/${name}` : name
  remove(homedir(rcPath))
}

/**
 * Updates or creates a user rc file (rc file under home directory).
 *
 * Default rc file name is ".butlerrc".
 *
 * @param config The config to upsert to the rc file.
 * @param options Options for rc9.
 */
export function upsertUserRc(config: any, options?: RCOptions): void {
  const rc = readUserRc(options)
  if (rc)
    updateUserRc(config, options)
  else
    writeUserRc(config, options)
}

/* ----- c12 ----- */

export type { ConfigLayerMeta, LoadConfigOptions } from 'c12'

/**
 * Loads the configuration using `c12`.
 *
 * Default config file name is "butler" and rc file loading is disabled.
 *
 * @param options Load config options.
 * @returns Configuration.
 */
export function loadConfig<
  M extends UserInputConfig = UserInputConfig,
  MT extends ConfigLayerMeta = ConfigLayerMeta,
>(options?: LoadConfigOptions<M, MT>): Promise<ResolvedConfig<M, MT>> {
  return _loadConfig({
    name: 'butler',
    rcFile: false,
    ...options,
  })
}
