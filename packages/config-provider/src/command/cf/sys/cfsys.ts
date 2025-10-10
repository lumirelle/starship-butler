import type { SystemOptions } from 'starship-butler-types'
import type { ActionHandlerContext, ConfigureSystemOptions } from './types'
import consola from 'consola'
import { upsertUserRc } from 'starship-butler-utils'
import { version } from '../../../../package.json'
import { filterActions } from './actions'
import { PRESET_ACTIONS } from './preset'

/**
 * Configure your system.
 *
 * @param options Configuration and command line interface options.
 * @param systemOptions Options contains user's system information.
 */
export async function configureSystem(options: Partial<ConfigureSystemOptions>, systemOptions: SystemOptions): Promise<void> {
  consola.debug('[config-provider] Configure system with options:', options)

  if (options.includeOnly && options.exclude) {
    consola.warn('It\'s not recommended to specify both `includeOnly` and `exclude` options. `includeOnly` has higher priority than `exclude`, may cause unexpected behavior.')
  }

  const filteredActions = filterActions(PRESET_ACTIONS, options)
  consola.debug(`[config-provider] Found ${filteredActions.length} actions to run.`)

  let hasError = false
  for (const action of filteredActions) {
    const context: ActionHandlerContext = {
      options,
      systemOptions,
      targetFolder: '',
    }

    consola.start(`Start to "${action.name}"...`)

    // Process `targetFolder`
    if (typeof action.targetFolder === 'function') {
      try {
        context.targetFolder = await action.targetFolder(context)
      }
      catch (error) {
        hasError = true
        consola.error(error)
      }
    }
    else {
      context.targetFolder = action.targetFolder
    }

    // Run `prehandler` if exist
    let shouldRun = true
    if (action.prehandler) {
      consola.debug(`[config-provider] Running prehandler for "${action.name}"...`)
      try {
        shouldRun = await action.prehandler(context)
      }
      catch (error) {
        shouldRun = false
        hasError = true
        consola.error(`Got an error while executing prehandler of "${action.name}", action stopped:`, error)
        continue
      }
    }
    if (!shouldRun) {
      consola.debug(`[config-provider] Skipping "${action.name}" because prehandler returned false or threw an error.`)
      continue
    }

    // Run `handler`
    consola.debug(`[config-provider] Running handler of "${action.name}"...`)
    try {
      await action.handler(context)
    }
    catch (error) {
      hasError = true
      consola.error(error)
    }

    // Run `posthandler` if exist
    if (action.posthandler) {
      if (options.dryRun) {
        consola.debug(`[config-provider] Skipping posthandler of "${action.name}" because it's a dry run.`)
        continue
      }
      consola.debug(`[config-provider] Running posthandler of "${action.name}"...`)
      try {
        await action.posthandler(context)
      }
      catch (error) {
        hasError = true
        consola.error(error)
      }
    }

    consola.log('') // New line
  }

  if (hasError) {
    consola.warn('Some actions failed. Please check the output info above carefully.')
  }
  else {
    // Store the version of config provider
    upsertUserRc('.butlerrc', {
      'config-provider': {
        version,
      },
    })

    consola.success('All actions completed. Please check the output info above carefully.')
  }
}
