import type { OptionsBasic, SystemOptions } from 'starship-butler-types'

/* --------------------------------- Config & CLI Options -------------------------------- */

/**
 * Basic options for config provider.
 */
interface ConfigProviderOptionsBasic extends OptionsBasic {
  /**
   * Actions should be ran.
   * @default []
   */
  include: string[] | string
  /**
   * Actions should not be ran.
   * @default []
   */
  exclude: string[] | string
  /**
   * Run actions forcedly, if you don't specify include or exclude options and force is true, this will recognized as fully configuring.
   * The version executed will be recorded in global rc file.
   * The next time the user runs the configure command, the recorded version will be used to determine if a full update is needed.
   * You can change the behavior by option `enableFullUpdate`.
   * @default false
   * @see enableFullUpdate
   */
  force: boolean
  /**
   * Use symlink instead of copy
   * @default false
   */
  symlink: boolean
  /**
   * Whether to enable fully update
   * @default true
   */
  fullyUpdate: boolean
}

/**
 * Config options for config provider.
 */
export interface ConfigProviderOptionsFromConfig extends ConfigProviderOptionsBasic {
  /**
   * User define actions, will cover default actions.
   * @default []
   */
  actions: Action[]
  /**
   * Version
   * @default See generated global rc file
   */
  version: string
}

/**
 * Command line options for config provider.
 */
export interface ConfigProviderOptionsFromCommandLine extends ConfigProviderOptionsBasic {}

/**
 * Config & Command line options for config provider.
 */
export type ConfigProviderOptions = ConfigProviderOptionsFromConfig & ConfigProviderOptionsFromCommandLine

/* --------------------------------- Actions -------------------------------- */

/**
 * Action interface for defining actions to run.
 */
export interface Action {
  /**
   * Action name
   */
  name: string
  /**
   * Prehandler for the action, if returns `false` or throw an error, the handler will not be executed.
   * @param options The options from user config and user command line input
   * @param systemOptions The options about system info
   * @returns Whether the action handler should be executed
   */
  prehandler?: (options: Partial<ConfigProviderOptions>, systemOptions: SystemOptions) => Promise<boolean> | boolean
  /**
   * Handler for the action
   * @param options The options from user config and user command line input
   * @param systemOptions The options about system info
   */
  handler: (options: Partial<ConfigProviderOptions>, systemOptions: SystemOptions) => Promise<void> | void
  /**
   * Run after handler is executed, useful for cleanup or other post-processing logic.
   * @param options The options from user config and user command line input
   * @param systemOptions The options about system info
   */
  posthandler?: (options: Partial<ConfigProviderOptions>, systemOptions: SystemOptions) => Promise<void> | void
}

/* ----------------------------- Process Config ----------------------------- */

export interface ProcessConfigOptions {
  /**
   * Use glob pattern matching.
   * WIP: Work in progress.
   * @default false
   */
  useGlob: boolean
  /**
   * Force overwrite existing files.
   * @default false
   */
  force: boolean
  /**
   * Mode
   * @default 'copy'
   */
  mode: 'copy' | 'symlink'
}
