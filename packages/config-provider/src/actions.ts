import type { UserInputConfig } from 'c12'
import type { Action } from './preset'
import type { SetSysOptions } from './set-sys'
import consola from 'consola'
import { DEFAULT_ACTIONS } from './preset'

export function filterActions(options: UserInputConfig & Partial<SetSysOptions>): Action[] {
  const effectActions = options.actions ? options.actions : DEFAULT_ACTIONS
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
