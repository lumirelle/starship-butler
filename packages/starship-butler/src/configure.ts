import type { UserInputConfig } from 'c12'
import type { ConfigureOptions } from './types'
import consola from 'consola'

interface Action {
  /**
   * Action name
   */
  name: string
  /**
   * Prehandler for the action, if returns `false` or throw an error, the handler will not be executed.
   * @param options The options from user config and user command line input
   * @returns Whether the action handler should be executed
   */
  prehandler?: (options: Partial<ConfigureOptions>) => boolean
  /**
   * Handler for the action
   * @param options The options from user config and user command line input
   */
  handler: (options: Partial<ConfigureOptions>) => void
  /**
   * Run after handler is executed, useful for cleanup or other post-processing logic.
   * @param options The options from user config and user command line input
   */
  posthandler?: (options: Partial<ConfigureOptions>) => void
}

export const actions: Action[] = [
  {
    name: 'Action 1',
    prehandler: () => false,
    handler: async (options) => {
      consola.log('Action 1 executed', options)
    },
  },
]

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
