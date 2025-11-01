import type { Action, ConfigureSystemOptions } from './types'
import { toArray } from '@antfu/utils'
import consola from 'consola'
import { highlight } from 'starship-butler-utils'

export function filterActions(actions: Action[], options: Partial<ConfigureSystemOptions>): Action[] {
  return actions.filter((action) => {
    // `includeOnly` has higher priority than `exclude`
    if (options.includeOnly) {
      const shouldIncluded = toArray(options.includeOnly).includes(action.id)
      if (!shouldIncluded) {
        consola.start(`Skip "${highlight.important(action.name)}" as it's not included.`)
        consola.log('') // New line
      }
      return shouldIncluded
    }
    // `exclude` has lower priority than `includeOnly`
    else if (options.exclude) {
      const shouldExcluded = toArray(options.exclude).includes(action.id)
      if (shouldExcluded) {
        consola.start(`Skip "${highlight.important(action.name)}" as it's excluded.`)
        consola.log('') // New line
      }
      return !shouldExcluded
    }
    // No `includeOnly` or `exclude`, include all actions
    return true
  })
}
