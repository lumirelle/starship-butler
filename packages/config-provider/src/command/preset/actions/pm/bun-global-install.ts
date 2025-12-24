import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { HandlerError } from '../../error'
import { ensureDirectoryExist, homedir, isPathExistEnv, processConfig } from '../utils'

const name = 'Bun Global Config'

const targetFolder = homedir('.bun', 'install', 'global')

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('pm', 'bun', 'bunfig.global-install.toml'),
    target: join(targetFolder, 'bunfig.toml'),
  }),
]

export function bunGlobalInstall(): Action {
  return {
    id: 'bun-global-install',
    name,
    targetFolder,
    prehandler: async () => {
      if (!(await isPathExistEnv('bun')))
        throw new HandlerError(`You should install ${name} first!`)
      if (!ensureDirectoryExist(targetFolder))
        throw new HandlerError(`Failed to ensure directory exists: ${targetFolder}`)
    },
    handler: async ({ options, targetFolder }) => {
      for (const generator of configPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
    posthandler: () => {
      consola.info('This configuration is meant to fix the behavior of bun\'s global package installation if you have set `install.linker=isolated` globally.')
    },
  }
}
