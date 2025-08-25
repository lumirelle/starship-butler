import type { Action } from './types'
import { homedir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import consola from 'consola'
import { fs } from 'starship-butler-utils'
import { processConfig } from './handler'

/**
 * Predefined actions to configure your system.
 */
export const DEFAULT_ACTIONS: Action[] = [
  /* --------------------------------- Shells --------------------------------- */
  {
    name: 'Setting Up Nushell',
    prehandler: (_, systemOptions) => {
      const { userPlatform } = systemOptions
      const shouldRun = userPlatform === 'win32' || userPlatform === 'linux' || userPlatform === 'darwin'
      if (!shouldRun) {
        consola.info(`NU: Just support win32, linux and darwin platform now.`)
      }
      return shouldRun
    }, // TODO: Support Unix-like system
    handler: async (options, systemOptions) => {
      const { force, symlink } = options
      const { userPlatform } = systemOptions
      const mode = symlink ? 'symlink' : 'copy'
      const target = userPlatform === 'win32'
        ? join(process.env.APPDATA!, 'nushell')
        : userPlatform === 'linux'
          ? join(homedir(), '.config', 'nushell')
          : userPlatform === 'darwin'
            ? join(homedir(), 'Library', 'Application Support', 'nushell')
            : ''
      fs.ensureDir(target)
      const handlerOperations = [
        { source: 'shell/nu/utils.nu', target: join(target, 'utils.nu') },
        { source: 'shell/nu/config.nu', target: join(target, 'config.nu') },
        { source: 'shell/nu/env.nu', target: join(target, 'env.nu') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode })
      }
    },
  },
  {
    name: 'Setting Up Bash',
    handler: async (options) => {
      const { force, symlink } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = homedir()
      fs.ensureDir(target)
      const handlerOperations = [
        { source: 'shell/bash/.bash_profile', target: join(target, '.bash_profile') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode })
      }
    },
  },
  {
    name: 'Setting Up CMD',
    prehandler: (_, systemOptions) => {
      const { userPlatform } = systemOptions
      const shouldRun = userPlatform === 'win32'
      if (!shouldRun) {
        consola.info(`CMD: Just support win32 platform.`)
      }
      return shouldRun
    },
    handler: async (options) => {
      const { force, symlink } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = join(homedir(), 'Documents', 'CMD')
      fs.ensureDir(target)
      const handlerOperations = [
        { source: 'shell/cmd/autorun.cmd', target: join(target, 'autorun.cmd') },
        { source: 'shell/cmd/autorun.reg', target: join(target, 'autorun.reg') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode })
      }
    },
    posthandler: () => {
      consola.info('Please running the `.reg` file with Registry Editor to enable autorun feature.')
    },
  },
]
