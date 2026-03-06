import type { Action, ConfigPathGenerator } from '../../types'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createHandler, ensureDirectoryExist, isPathExistEnv } from '../../actions/utils'
import { HandlerError } from '../../error'

const APP_NAME = 'Maven'

const TARGET_FOLDER = homedir('.m2')

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('pm', 'maven', 'settings.xml'),
    target: join(targetFolder, 'settings.xml'),
  }),
]
export function maven(): Action {
  return {
    id: 'maven',
    name: APP_NAME,
    targetFolder: TARGET_FOLDER,
    prehandler: async ({ targetFolder }) => {
      if (!(await isPathExistEnv('mvn'))) {
        throw new HandlerError(`You should install ${APP_NAME} first!`)
      }
      if (!ensureDirectoryExist(targetFolder)) {
        throw new HandlerError(`Failed to create maven folder: ${targetFolder}`)
      }
    },
    handler: createHandler(CONFIG_PATH_GENERATORS),
  }
}
