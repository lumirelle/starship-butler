import type { ActionHandlerContext, PresetOptions } from './types'
import { consola } from 'consola'
import { important } from 'starship-butler-utils/highlight'
import { version } from '../../../package.json'
import { ASSETS_FOLDER } from '../../constants'
import { upsertUserRc } from '../utils'
import { filterActions } from './actions'
import { HandlerError } from './error'
import { validateOptions } from './validate'

const PERMISSION_ERROR_REGEX = /EACCES|EPERM/

/**
 * Preset application configurations.
 *
 * @param options Configuration and command line interface options.
 */
export async function commandPreset(options: PresetOptions): Promise<void> {
  consola.debug('[config-provider] Assets folder path:', ASSETS_FOLDER)
  consola.debug('[config-provider] Received preset options:', options)

  if (!validateOptions(options)) {
    consola.debug('[config-provider] Invalid options detected, aborting configuration.')
    return
  }

  // Update the version of preset
  upsertUserRc({ version })

  const actions = await filterActions(options)
  consola.debug(`[config-provider] Found ${actions.length} preset${actions.length > 1 ? 's' : ''}.`)

  let errorCount = 0
  for (const action of actions) {
    const context: ActionHandlerContext = {
      id: action.id,
      name: action.name,
      base: action.base,
      options,
      destination: '',
    }
    // New line
    consola.log('')
    consola.start(`Applying ${important(action.name)} preset...`)

    try {
      // Process `targetFolder`
      const destination
        = typeof action.destination === 'function'
          ? await action.destination(context)
          : action.destination
      if (destination == null)
        throw new HandlerError(`Destination configuration folder for "${important(action.name)}" is not defined, is that application does not support your system platform?`)
      context.destination = destination

      // Run `prehandler` if exist
      if (action.prehandler) {
        consola.debug(`[config-provider] Running prehandler of "${important(action.name)}"...`)
        await action.prehandler(context)
      }

      // Run `handler`
      consola.debug(`[config-provider] Running handler of "${important(action.name)}"...`)
      await action.handler(context)

      // Run `posthandler` if exist
      if (action.posthandler) {
        consola.debug(`[config-provider] Running posthandler of "${important(action.name)}"...`)
        await action.posthandler(context)
      }
    }
    catch (error) {
      errorCount++
      if (error instanceof HandlerError)
        consola.error(error.message)
      else if (error instanceof Error && PERMISSION_ERROR_REGEX.test(error.message))
        consola.error(`Got a permission error while applying "${important(action.name)}" preset, please try running the command with admin privileges.`)
      else
        consola.error(`Got an error while applying "${important(action.name)}" preset, process stopped. Reason: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (actions.length === 0)
    consola.info('No presets to apply. Do you forget to specify include patterns with `--include` or `--all` option? For more information, please run with `--help` option.')
  else if (errorCount === actions.length)
    consola.error('All presets applied failed. Please check the output above for notices.')
  else if (errorCount > 0)
    consola.warn('Some presets applied failed. Please check the output above for notices.')
  else
    consola.success('All presets applied completed. Please check the output above for notices.')
}
