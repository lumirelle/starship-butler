import type { Action, ConfigPathGenerator } from '../../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, ensureDirectoryExist, isPathExistEnv } from '../utils'

const APP_NAME = 'Bun'

const TARGET_FOLDER = homedir()

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('pm', 'bun', 'bunfig.global.toml'),
    target: join(targetFolder, '.bunfig.toml'),
  }),
  ({ targetFolder }) => ({
    source: join('pm', 'bun', 'bunfig.global-install.toml'),
    target: join(targetFolder, '.bun', 'install', 'global', 'bunfig.toml'),
  }),
]
export function bun(): Action {
  return {
    id: 'bun',
    name: APP_NAME,
    targetFolder: TARGET_FOLDER,
    prehandler: async () => {
      if (!(await isPathExistEnv('bun'))) {
        throw new HandlerError(`You should install ${APP_NAME} first!`)
      }
      const globalInstallFolder = homedir('.bun', 'install', 'global')
      if (!ensureDirectoryExist(globalInstallFolder)) {
        throw new HandlerError(`Failed to create bun global install folder: ${globalInstallFolder}`)
      }
    },
    handler: createHandler(CONFIG_PATH_GENERATORS),
    posthandler: () => {
      consola.info(
        `The global install s configuration is meant to fix the behavior of bun's global package installation if you are using \`install.linker=isolated\` globally.`,
      )
    },
  }
}
