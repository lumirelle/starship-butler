import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'consola'
import { homedir, join } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, ensureDirectoryExist, isPathExistEnv } from '../utils'

const name = 'Bun'

const targetFolder = homedir()

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('pm', 'bun', 'bunfig.toml'),
    target: join(targetFolder, '.bunfig.toml'),
  }),
  (targetFolder: string) => ({
    source: join('pm', 'bun', 'bunfig.global-install.toml'),
    target: join(targetFolder, '.bun', 'install', 'global', 'bunfig.toml'),
  }),
]
export function bun(): Action {
  return {
    id: 'bun',
    name,
    targetFolder,
    prehandler: async () => {
      if (!(await isPathExistEnv('bun')))
        throw new HandlerError(`You should install ${name} first!`)
      const globalInstallFolder = homedir('.bun', 'install', 'global')
      if (!ensureDirectoryExist(globalInstallFolder))
        throw new HandlerError(`Failed to create bun global install folder: ${globalInstallFolder}`)
    },
    handler: createHandler(configPathGenerators),
    posthandler: () => {
      consola.info('The global install s configuration is meant to fix the behavior of bun\'s global package installation if you are using `install.linker=isolated` globally.')
    },
  }
}
