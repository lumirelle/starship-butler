import type { UserInputConfig } from 'c12'
import type { Action, ConfigureOptions } from './types'
import consola from 'consola'

/**
 * Predefined actions to configure your system.
 */
export const defaultActions: Action[] = [
  {
    name: 'Action 1 with prehandler returns true',
    prehandler: () => true,
    handler: async () => {
    },
  },
  {
    name: 'Action 2 with prehandler returns false',
    prehandler: () => false,
    handler: async () => {
    },
  },
]

export function filterActions(options: UserInputConfig & Partial<ConfigureOptions>): Action[] {
  const effectActions = options.actions ? options.actions : defaultActions
  return effectActions.filter((action) => {
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
}
