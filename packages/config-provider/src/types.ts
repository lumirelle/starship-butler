import type { OptionsBasic } from 'starship-butler-types'

/* --------------------------------- Options -------------------------------- */

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
   * Run actions forcedly
   * @default false
   */
  force: boolean
  /**
   * Use symlink instead of copy
   * @default false
   */
  symlink: boolean
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
   * @returns Whether the action handler should be executed
   */
  prehandler?: (options: Partial<ConfigProviderOptions>) => boolean
  /**
   * Handler for the action
   * @param options The options from user config and user command line input
   */
  handler: (options: Partial<ConfigProviderOptions>) => void
  /**
   * Run after handler is executed, useful for cleanup or other post-processing logic.
   * @param options The options from user config and user command line input
   */
  posthandler?: (options: Partial<ConfigProviderOptions>) => void
}

/* ----------------------------- Process Config ----------------------------- */

export interface ProcessConfigOptions {
  /**
   * Use glob pattern matching.
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
