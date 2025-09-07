import type { OptionsBasic, SystemOptions } from 'starship-butler-types'
import type { Action } from './preset'
import consola from 'consola'
import semver from 'semver'
import { upsertUserRc } from 'starship-butler-utils'
import { version as versionInPackage } from '../package.json'
import { filterActions } from './actions'
import { DEFAULT_ACTIONS } from './preset'

/**
 * Options for command `set-sys`.
 */
export interface SetSysOptions extends OptionsBasic {
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
 * Config options for command `set-sys`.
 */
export interface SetSysOptionsFromConfig extends SetSysOptions {}

/**
 * Command line options for command `set-sys`.
 */
export type SetSysOptionsFromCommandLine = Omit<SetSysOptions, 'actions' | 'version'>

/**
 * Running actions to setting up your system.
 * @param options Configuration and command line options
 * @param systemOptions User system information options
 */
export async function settingUpSystem(options: Partial<SetSysOptions>, systemOptions: SystemOptions): Promise<void> {
  // If `version` is provided, that means the user already fully configured his/her system before
  // Fully configuring means all actions available are included and forcibly executed
  // If that `version` is lower than the current package version, we will fully update
  const needUpdate = Boolean((options.version && semver.lt(options.version, versionInPackage)))
  if (options.fullyUpdate && needUpdate) {
    consola.info(`Detect global .butlerrc file with old version ${options.version}, will fully update all config.`)
    options.force = true
  }

  consola.debug('[config-provider] Setting up system with options:', options)

  if (options.include && options.exclude) {
    consola.warn('Don\'t specify both include and exclude options. Notice that, Include has higher priority than exclude.')
  }

  const filteredActions = filterActions(options)
  consola.debug(`[config-provider] Found ${filteredActions.length} actions to run.`)

  for (const action of filteredActions) {
    let shouldRun = true
    if (action.prehandler) {
      consola.debug(`[config-provider] Running prehandler for "${action.name}"...`)
      try {
        shouldRun = await action.prehandler(options, systemOptions)
      }
      catch (error) {
        shouldRun = false
        consola.error(`Error in prehandler of "${action.name}", action stopped:`, error)
        return
      }
    }

    if (!shouldRun) {
      consola.debug(`[config-provider] Skipping "${action.name}" because prehandler returned false or threw an error.`)
      return
    }

    consola.log('') // New line
    consola.start(`Start to "${action.name}"...`)
    consola.debug(`[config-provider] Running handler for "${action.name}"...`)
    await action.handler(options, systemOptions)

    if (action.posthandler) {
      consola.debug(`[config-provider] Running posthandler for "${action.name}"...`)
      await action.posthandler(options, systemOptions)
    }
  }

  // If fully configuring, store the version of config provider
  const isFullyConfiguring = (!options.include || filteredActions.length === DEFAULT_ACTIONS.length) && !options.exclude && options.force
  if (isFullyConfiguring) {
    upsertUserRc('.butlerrc', {
      'config-provider': {
        version: versionInPackage,
      },
    })
  }

  consola.log('') // New line
  consola.success('All actions completed. Please check the output info above carefully.')
}
