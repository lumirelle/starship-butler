import type { Arrayable, Awaitable } from '@antfu/utils'
import type { SystemOptions } from 'starship-butler-types'
import type { ProcessConfigOptions } from '../../utils/types'

export type ActionId = 'clash-verge-rev'
  | 'windows-terminal'
  | 'nushell'
  | 'bash'
  | 'powershell'
  | 'windows-powershell'
  | 'starship'
  | 'git'
  | 'bun'
  | 'bun-global-install'
  | 'maven'
  | '@sxzz/create'
  | 'vscode'
  | 'cursor'
  | 'cursor-mcp'
  | 'zed'
  | 'nvim'
  | 'cspell'

/**
 * (Configuration and Command-line) Options for preset command.
 */
export interface PresetOptions extends ProcessConfigOptions {
  /**
   * Presets that you want to include, accepts JavaScript regex pattern
   * string(s).
   *
   * @default undefined
   */
  include: Arrayable<string>
  /**
   * Presets that you want to exclude (apply on included presets), accepts
   * JavaScript regex pattern string(s).
   *
   * @default undefined
   */
  exclude: Arrayable<string>
  /**
   * Applying all presets, overrides `include` and `exclude` options with `[*]`
   * and `[]` whatever they are provided.
   *
   * @default false
   */
  all: boolean
}

/**
 * A map from platform to target folder, used for defining the target folders
 * for a multi-platform preset action.
 */
export type PlatformTargetFolderMap = {
  [platform in NodeJS.Platform]?: string
}

/**
 * Context provided to the preset action handlers.
 */
export interface ActionHandlerContext {
  /**
   * Configuration and command-line options.
   */
  options: Partial<PresetOptions>
  /**
   * Options contains user's system information.
   */
  systemOptions: SystemOptions
  /**
   * The resolved target folder for the preset.
   */
  targetFolder: string
}

/**
 * Preset action definition.
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
   * Preset configuration target folder. Accepts a string or a action handler
   * function that returns a string.
   *
   * @param context Context provided to action handler.
   * @returns The resolved target folder for the preset.
   */
  targetFolder: string | ((context: Omit<ActionHandlerContext, 'targetFolder'>) => Awaitable<string>)
  /**
   * Prehandler for the action, if returns `false` or throw an error, the handler will not be executed.
   *
   * @param context Context provided to action handler.
   * @returns Whether the action handler should be executed.
   * @throws {Error} If prehandler fails.
   */
  prehandler?: (context: ActionHandlerContext) => Awaitable<boolean>
  /**
   * Handler for the action. All the logic for applying the preset should be
   * implemented here.
   *
   * @param context Context provided to action handler.
   */
  handler: (context: ActionHandlerContext) => Awaitable<void>
  /**
   * Run after handler is executed, useful for cleanup or prompt the additional
   * but essential message to the user.
   *
   * @param context Context provided to action handler.
   */
  posthandler?: (context: ActionHandlerContext) => Awaitable<void>
}

/**
 * Each generator will return source and target paths for a configuration file
 * in the target folder.
 *
 * So a list of generators can be used to define how configuration files should
 * be applied for a preset action.
 */
export type ConfigPathGenerator = (targetFolder: string) => {
  source: string
  target: string
}
