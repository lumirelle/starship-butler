import type { defaults } from 'rc9'
import process from 'node:process'
import { readUserConfig as _readUserConfig, updateUserConfig as _updateUserConfig, writeUserConfig as _writeUserConfig } from 'rc9'
import { exists, remove } from '../fs'
import { homedir } from '../path'

export type RC = Record<string, any>
export type RCOptions = typeof defaults

const DEFAULT_NAME = '.butlerrc'

/**
 * Reads a user configuration file from `$XDG_CONFIG_HOME` or `$HOME/.config` and parses its contents.
 *
 * Default user configuration file name is ".butlerrc".
 *
 * @param options Options for reading the configuration file. See {@link RCOptions}.
 * @returns The parsed configuration object.
 */
export function readUserConfig(options?: RCOptions): RC {
  return _readUserConfig({
    name: DEFAULT_NAME,
    ...options,
  })
}

/**
 * Writes a configuration object to a file in `$XDG_CONFIG_HOME` or `$HOME/.config`.
 *
 * Default user configuration file name is ".butlerrc".
 *
 * @param config The configuration object to write. See {@link RC}.
 * @param options Options for writing the configuration file. See {@link RCOptions}.
 */
export function writeUserConfig(config: RC, options?: RCOptions): void {
  _writeUserConfig(config, {
    name: DEFAULT_NAME,
    ...options,
  })
}

/**
 * Updates a configuration object in `$XDG_CONFIG_HOME` or `$HOME/.config` by merging and writing the result.
 *
 * Default user configuration file name is ".butlerrc".
 *
 * @param config The configuration object to update. See {@link RC}.
 * @param options Options for updating the configuration file. See {@link RCOptions}.
 * @returns The updated configuration object.
 */
export function updateUserConfig(config: RC, options?: RCOptions): RC {
  return _updateUserConfig(config, {
    name: DEFAULT_NAME,
    ...options,
  })
}

/**
 * Updates or writes a configuration object to a file in `$XDG_CONFIG_HOME` or `$HOME/.config`.
 *
 * Default user configuration file name is ".butlerrc".
 *
 * @param config The configuration object to update or write. See {@link RC}.
 * @param options Options for updating or writing the configuration file. See {@link RCOptions}.
 * @returns The updated configuration object if the file existed, otherwise void.
 */
export function upsertUserConfig(config: RC, options?: RCOptions): RC | void {
  const DEFAULT_DIR = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : homedir('.config')
  const { dir = DEFAULT_DIR, name = DEFAULT_NAME } = options ?? {}
  const rcPath = dir ? `${dir}/${name}` : name
  if (exists(rcPath))
    return updateUserConfig(config, options)
  else
    return writeUserConfig(config, options)
}

/**
 * Removes a user configuration file from `$XDG_CONFIG_HOME` or `$HOME/.config`.
 *
 * Default user configuration file name is ".butlerrc".
 *
 * @param options Options for removing the configuration file. See {@link RCOptions}.
 */
export function removeUserConfig(options?: RCOptions): void {
  const DEFAULT_DIR = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : homedir('.config')
  const { dir = DEFAULT_DIR, name = DEFAULT_NAME } = options ?? {}
  const rcPath = dir ? `${dir}/${name}` : name
  remove(rcPath)
}
