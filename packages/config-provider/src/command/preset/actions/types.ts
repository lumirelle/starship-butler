import type { Awaitable, Nullable } from '@antfu/utils'
import type { PresetOptions } from '../types'

type ActionId
  = | 'clash-verge-rev'
    | 'windows-terminal'
    | 'nushell'
    | 'bash'
    | 'powershell'
    | 'windows-powershell'
    | 'starship'
    | 'git'
    | 'maven'
    | '@sxzz/create'
    | 'vscode'
    | 'zed'
    | 'nvim'
    | 'cspell'
    | 'rime'

interface ActionBase {
/**
 * Action identifier.
 */
  id: ActionId
  /**
   * Action name.
   */
  name: string
  /**
   * Configurations base folder, relative to `ASSETS_FOLDER`.
   *
   * @see {ASSETS_FOLDER} in `packages/config-provider/src/constants.ts`
   */
  base: string
}

/**
 * Context provided to the preset action handlers when they are executed.
 */
export interface ActionHandlerContext extends ActionBase {
  /**
   * The resolved destination folder for the preset.
   */
  destination: string
  /**
   * Configuration and command-line options.
   */
  options: PresetOptions
}
export type DestinationHandler = (context: Omit<ActionHandlerContext, 'destination'>) => Awaitable<string | undefined>
export type ActionHandler = (context: ActionHandlerContext) => Awaitable<void>

/**
 * Preset action definition.
 */
export interface Action extends ActionBase {
  /**
   * Configurations destination folder. Accepts a string or a action handler function that returns a string.
   *
   * @param context Context provided to action handler.
   * @returns The resolved destination folder for the preset.
   */
  destination: | string | DestinationHandler
  /**
   * Prehandler for the action, if throws an error, the handler will not be executed, and this action will be considered failed.
   *
   * @param context Context provided to action handler.
   * @throws {Error} When precondition is not met.
   */
  prehandler?: ActionHandler
  /**
   * Handler for the action. All the logic of applying the preset should be implemented here.
   *
   * @param context Context provided to action handler.
   */
  handler: ActionHandler
  /**
   * Run after handler is executed, useful for cleanup or prompt the additional but essential message to the user.
   *
   * @param context Context provided to action handler.
   */
  posthandler?: ActionHandler
}

/**
 * Factory for creating preset actions, returns `undefined` when the action is not applicable (e.g. platform mismatch), in order that to hidden these actions from user.
 */
export type ActionFactory = () => Action | undefined

/**
 * A map from platform to destination folder, useful for multi-platform support.
 */
export type PlatformDestinationMap = Partial<Record<NodeJS.Platform, string>>

/**
 * Each generator will return source and target paths for a configuration file in the destination folder.
 *
 * So a list of generators can be used to define what configuration files should be applied in a preset action.
 *
 * When returning `null` or `undefined`, that configuration file will be skipped.
 *
 * @param context Context received from action handler.
 */
export type ConfigPathGenerator = (context: ActionHandlerContext) => Nullable<{
  source: string
  target: string
}>
