import type { SystemOptions } from 'starship-butler-types'
import type { ActionHandlerContext, PresetOptions } from './types'
import consola from 'consola'
import { upsertUserRc } from 'starship-butler-utils/config'
import { important } from 'starship-butler-utils/highlight'
import { version } from '../../../package.json'
import { filterActions } from './actions'
import { HandlerError } from './error'
import { validateOptions } from './validate'

/**
 * Preset application configurations.
 *
 * @param options Configuration and command line interface options.
 * @param systemOptions Options contains user's system information.
 */
export async function commandPreset(
  options: Partial<PresetOptions>,
  systemOptions: SystemOptions,
): Promise<void> {
  consola.debug('[config-provider] Received preset options:', options)
  consola.debug('[config-provider] Received user system options:', systemOptions)

  if (!validateOptions(options)) {
    consola.debug('[config-provider] Invalid options detected, aborting configuration.')
    return
  }

  // Update the version of preset
  upsertUserRc({
    'config-provider': {
      version,
    },
  })

  const actions = await filterActions(options)
  consola.debug(`[config-provider] Found ${actions.length} preset${actions.length > 1 ? 's' : ''}.`)

  let errorCount = 0
  for (const action of actions) {
    const context: ActionHandlerContext = {
      options,
      systemOptions,
      targetFolder: '',
    }
    consola.log('') // New line
    consola.start(`Applying ${important(`"${action.name}"`)} preset...`)

    try {
      // Process `targetFolder`
      if (typeof action.targetFolder === 'function')
        context.targetFolder = await action.targetFolder(context)
      else
        context.targetFolder = action.targetFolder

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
      if (!(error instanceof Error))
        console.error(error)
      else if (error instanceof HandlerError)
        consola.error(error.message)
      else if (['EACCES', 'EPERM'].some(code => error.message.includes(code)))
        consola.error(`Got a permission error while applying "${important(action.name)}" preset, please try running the command with admin privileges.`)
      else
        consola.error(`Got an error while applying "${important(action.name)}" preset, process stopped. Reason: ${error.message}`)
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
