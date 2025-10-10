import type { SystemOptions } from 'starship-butler-types'
import type { ActionHandlerContext, ConfigureSystemOptions } from './types'
import consola from 'consola'
import { highlight, upsertUserRc } from 'starship-butler-utils'
import { version } from '../../../../package.json'
import { filterActions } from './actions'
import { PRESET_ACTIONS } from './preset'
import { validateOptions } from './validate'

/**
 * Configure your system.
 *
 * @param options Configuration and command line interface options.
 * @param systemOptions Options contains user's system information.
 */
export async function configureSystem(
  options: Partial<ConfigureSystemOptions>,
  systemOptions: SystemOptions,
): Promise<void> {
  consola.debug('[config-provider] Configure system with options:', options)

  if (!validateOptions(options)) {
    consola.debug('[config-provider] Invalid options detected, aborting configuration.')
    return
  }

  const filteredActions = filterActions(PRESET_ACTIONS, options)
  consola.debug(`[config-provider] Found ${filteredActions.length} actions to run.`)

  let errorCount = 0
  for (const action of filteredActions) {
    const context: ActionHandlerContext = {
      options,
      systemOptions,
      targetFolder: '',
    }

    consola.start(`Start to "${highlight.important(action.name)}"...`)

    try {
      // Process `targetFolder`
      if (typeof action.targetFolder === 'function') {
        context.targetFolder = await action.targetFolder(context)
      }
      else {
        context.targetFolder = action.targetFolder
      }

      // Run `prehandler` if exist
      let shouldRun = true
      if (action.prehandler) {
        consola.debug(`[config-provider] Running prehandler for "${highlight.important(action.name)}"...`)
        shouldRun = await action.prehandler(context)
      }
      if (!shouldRun) {
        consola.debug(`[config-provider] Skipping "${highlight.important(action.name)}" because prehandler returned false or threw an error.`)
        continue
      }

      // Run `handler`
      consola.debug(`[config-provider] Running handler of "${highlight.important(action.name)}"...`)
      await action.handler(context)

      // Run `posthandler` if exist
      if (action.posthandler) {
        if (options.dryRun) {
          consola.debug(`[config-provider] Skipping posthandler of "${highlight.important(action.name)}" because it's a dry run.`)
          continue
        }
        consola.debug(`[config-provider] Running posthandler of "${highlight.important(action.name)}"...`)
        await action.posthandler(context)
      }
    }
    catch (error) {
      errorCount++
      if (error instanceof Error) {
        if (error.message.includes('EACCES') || error.message.includes('EPERM')) {
          consola.error(`Got a permission error while executing action "${highlight.important(action.name)}", please try running the command with admin privileges.`)
        }
        else {
          consola.error(`Got an error while executing action "${highlight.important(action.name)}", process stopped. Reason:\n${error.message}`)
        }
      }
    }

    consola.log('') // New line
  }

  if (errorCount === filteredActions.length) {
    consola.error('All actions failed. Please check the output info above carefully.')
  }
  else if (errorCount > 0) {
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
