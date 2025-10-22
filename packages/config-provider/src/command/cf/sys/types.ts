import type { Arrayable, Awaitable } from '@antfu/utils'
import type process from 'node:process'
import type { BasicOptions, SystemOptions } from 'starship-butler-types'

export type ActionId = 'clash-verge-rev'
  | 'windows-terminal'
  | 'nushell'
  | 'bash'
  | 'cmd'
  | 'powershell'
  | 'starship'
  | 'git'
  | 'maven'
  | '@sxzz/create'
  | 'simple-git-hooks'
  | 'czg'
  | 'vscode'
  | 'cursor'
  | 'zed'
  | 'nvim'
  | 'cspell'

/**
 * Options to configure system for both configuration & command line interface.
 */
export interface ConfigureSystemOptions extends BasicOptions {
  /**
   * Preset configuring actions that are included only.
   *
   * @default undefined
   */
  includeOnly: Arrayable<ActionId>
  /**
   * Preset configuring actions that are excluded.
   *
   * @default undefined
   */
  exclude: Arrayable<ActionId>
  /**
   * Run configuring actions forcedly, will override the existing configuration with the same name.
   *
   * @default false
   */
  force: boolean
  /**
   * Symlink or copy-paste configuration.
   *
   * CAUTION: Symlink mode is experimental now.
   *
   * @default 'copy-paste'
   */
  mode: 'copy-paste' | 'symlink'
}

export type TargetMap = {
  [key in typeof process.platform]?: string
}

/**
 * Context provided to action handlers.
 */
export interface ActionHandlerContext {
  /**
   * Configuration and command line interface options.
   */
  options: Partial<ConfigureSystemOptions>
  /**
   * Options contains user's system information.
   */
  systemOptions: SystemOptions
  /**
   * The resolved target folder for the action.
   */
  targetFolder: string
}

/**
 * Action interface for defining actions to run.
 */
export interface Action {
  /**
   * Action identifier.
   */
  id: ActionId
  /**
   * Action name.
   */
  name: string
  /**
   * Configuration target folder. Accepts a string or a action handler function that returns a string.
   *
   * @param context Context provided to action handler.
   * @returns Configuration target folder.
   */
  targetFolder: string | ((context: Omit<ActionHandlerContext, 'targetFolder'>) => Awaitable<string>)
  /**
   * Prehandler for the action, if returns `false` or throw an error, the handler will not be executed.
   *
   * @param context Context provided to action handler.
   * @returns Whether the action handler should be executed.
   */
  prehandler?: (context: ActionHandlerContext) => Awaitable<boolean>
  /**
   * Handler for the action.
   *
   * @param context Context provided to action handler.
   */
  handler: (context: ActionHandlerContext) => Awaitable<void>
  /**
   * Run after handler is executed, useful for cleanup or other post-processing logic.
   *
   * @param context Context provided to action handler.
   */
  posthandler?: (context: ActionHandlerContext) => Awaitable<void>
}
