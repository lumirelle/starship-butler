import type { ConfigProviderOptions } from './types'
import consola from 'consola'
import { filterActions } from './actions'

/**
 * Running actions to configure your system. The entry of this package.
 * @param options User configuration and command line options
 */
export async function runActions(options: Partial<ConfigProviderOptions>): Promise<void> {
  consola.debug('[config-provider] Running actions with options:', options)

  if (options.include && options.exclude) {
    consola.warn('Don\'t specify both include and exclude options. Notice that, Include has higher priority than exclude.')
  }

  const filteredActions = filterActions(options)

  consola.debug(`[config-provider] Found ${filteredActions.length} actions to run.`)

  filteredActions.forEach((action) => {
    let shouldRun = true
    if (action.prehandler) {
      try {
        shouldRun = action.prehandler(options)
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

    consola.info(`Running "${action.name}"...`)
    action.handler(options)

    if (action.posthandler) {
      consola.debug(`[config-provider] Running posthandler for "${action.name}"...`)
      action.posthandler(options)
    }
  })

  // TODO: Update last configuring timestamp
}
