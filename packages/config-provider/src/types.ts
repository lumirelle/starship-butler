import type { OptionsBasic } from 'starship-butler-types'

/**
 * Basic options for config provider.
 */
interface ConfigProviderOptionsBasic extends OptionsBasic {
  /**
   * Actions should be ran.
   */
  include?: string[] | string
  /**
   * Actions should not be ran.
   */
  exclude?: string[] | string
  /**
   * Run actions forcedly
   */
  force?: boolean
  /**
   * Dry run.
   */
  dryRun?: boolean
}

/**
 * Config options for config provider.
 */
export interface ConfigProviderOptionsFromConfig extends ConfigProviderOptionsBasic {
  /**
   * User define actions, will cover default actions.
   */
  actions?: Action[]
}

/**
 * Command line options for config provider.
 */
export interface ConfigProviderOptionsFromCommandLine extends ConfigProviderOptionsBasic {}

/**
 * Config & Command line options for config provider.
 */
export type ConfigProviderOptions = ConfigProviderOptionsFromConfig & ConfigProviderOptionsFromCommandLine

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
