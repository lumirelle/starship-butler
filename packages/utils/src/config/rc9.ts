import type { defaults } from 'rc9'
import process from 'node:process'
import { readUserConfig, updateUserConfig, writeUserConfig } from 'rc9'
import { exists, remove } from '../fs'
import { homedir } from '../path'

export type RCOptions = typeof defaults

export type RC = Record<string, any>

const RC_FILE_NAME = '.butlerrc'

/**
 * Reads the user rc file (rc file under home directory).
 *
 * Default rc file name is ".butlerrc".
 *
 * @param options Options for rc9.
 * @returns The rc content.
 */
export function readUserRc(options?: RCOptions): RC {
  return readUserConfig({
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
export function writeUserRc(config: RC, options?: RCOptions): void {
  writeUserConfig(config, {
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
export function updateUserRc(config: RC, options?: RCOptions): RC {
  return updateUserConfig(config, {
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
  const defaultDir = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : homedir('.config')
  const { dir = defaultDir, name = RC_FILE_NAME } = options ?? {}
  const rcPath = dir ? `${dir}/${name}` : name
  remove(rcPath)
}

/**
 * Updates or creates a user rc file (rc file under home directory).
 *
 * Default rc file name is ".butlerrc".
 *
 * @param config The config to upsert to the rc file.
 * @param options Options for rc9.
 */
export function upsertUserRc(config: RC, options?: RCOptions): void {
  const defaultDir = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : homedir('.config')
  const { dir = defaultDir, name = RC_FILE_NAME } = options ?? {}
  const rcPath = dir ? `${dir}/${name}` : name
  if (exists(rcPath)) {
    updateUserRc(config, options)
  }
  else {
    writeUserRc(config, options)
  }
}
