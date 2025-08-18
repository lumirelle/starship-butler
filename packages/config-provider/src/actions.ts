import type { UserInputConfig } from 'c12'
import type { Action, ConfigureOptions } from './types'
import { join } from 'node:path'
import process from 'node:process'
import consola from 'consola'
import { fs } from 'starship-butler-utils'
import { copyConfig } from './handler'

/**
 * Predefined actions to configure your system.
 */
export const defaultActions: Action[] = [
  {
    name: 'Setting Up Nushell',
    prehandler: () => {
      const shouldRun = process.env.APPDATA != null
      if (!shouldRun) {
        consola.info(`NU: Unix-like system support is a work in progress.`)
      }
      return shouldRun
    }, // TODO: Support Unix-like system
    handler: async (options) => {
      const { force } = options
      const target = join(process.env.APPDATA!, 'nushell')
      fs.ensureDir(target)
      const handlerOperations = [
        { source: 'shell/nu/config.nu', target: join(target, 'config.nu') },
        { source: 'shell/nu/defs.nu', target: join(target, 'defs.nu') },
        { source: 'shell/nu/env.nu', target: join(target, 'env.nu') },
      ]
      try {
        for (const operation of handlerOperations) {
          copyConfig(operation.source, operation.target, { force })
        }
      }
      catch (error) {
        consola.error(`Failed to copy config: ${error}`)
        for (const operation of handlerOperations) {
          fs.removeFile(operation.target)
        }
      }
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
