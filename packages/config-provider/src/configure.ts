import type { UserInputConfig } from 'c12'
import type { ConfigureOptions } from './types'
import consola from 'consola'
import { actions } from './actions'

/**
 * Running actions to configure your system.
 * @param options User configuration and command line options
 */
export function runActions(options: UserInputConfig & Partial<ConfigureOptions>): void {
  if (options.verbose) {
    consola.info('Running actions with options:', options)
  }

  if (options.include && options.exclude) {
    consola.warn('Don\'t specify both include and exclude options. Notice that, Include has higher priority than exclude.')
  }

  const filteredActions = actions.filter((action) => {
    if (options.include) {
      const shouldIncluded = options.include === action.name || (Array.isArray(options.include) && options.include.includes(action.name))
      if (!shouldIncluded) {
        consola.info(`Skipping "${action.name}" as it's not included.`)
      }
      return shouldIncluded
    }
    if (options.exclude) {
      const shouldExcluded = options.exclude !== action.name && !(Array.isArray(options.exclude) && options.exclude.includes(action.name))
      if (shouldExcluded) {
        consola.info(`Skipping "${action.name}" as it's excluded.`)
      }
      return shouldExcluded
    }
    return true
  })

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
      consola.debug(`Skipping "${action.name}" because prehandler returned false or threw an error.`)
      return
    }

    consola.info(`Running "${action.name}"...`)
    action.handler(options)

    if (action.posthandler) {
      consola.debug(`Running posthandler for "${action.name}"...`)
      action.posthandler(options)
    }
  })
}
