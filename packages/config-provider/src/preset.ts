import type { Action } from './types'
import { join } from 'node:path'
import process from 'node:process'
import consola from 'consola'
import { fs } from 'starship-butler-utils'
import { processConfig } from './handler'

/**
 * Predefined actions to configure your system.
 */
export const DEFAULT_ACTIONS: Action[] = [
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
      const { force, symlink } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = join(process.env.APPDATA!, 'nushell')
      fs.ensureDir(target)
      const handlerOperations = [
        { source: 'shell/nu/config.nu', target: join(target, 'config.nu') },
        { source: 'shell/nu/defs.nu', target: join(target, 'defs.nu') },
        { source: 'shell/nu/env.nu', target: join(target, 'env.nu') },
      ]
      for (const operation of handlerOperations) {
        processConfig(operation.source, operation.target, { force, mode })
      }
    },
  },
]
