import type { UserInputConfig } from 'c12'
import type { ConfigureOptions } from './types'
import consola from 'consola'

interface Action {
  name: string
  handler: (options: Partial<ConfigureOptions>) => Promise<void>
}

export const actions: Action[] = [
  {
    name: 'Action 1',
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
    consola.info(`Running "${action.name}"...`)
    action.handler(options)
  })
}
