import type { Action, ConfigPathGenerator } from '../../types'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createHandler, ensureDirectoryExist, isPathExistEnv } from '../../actions/utils'
import { HandlerError } from '../../error'

const APP_NAME = '@sxzz/create'

const TARGET_FOLDER = homedir('.config')

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('tools', 'sxzz_create', 'create.config.yml'),
    target: join(targetFolder, 'create.config.yml'),
  }),
]
export function sxzzCreate(): Action {
  return {
    id: '@sxzz/create',
    name: APP_NAME,
    targetFolder: TARGET_FOLDER,
    prehandler: async () => {
      if (!(await isPathExistEnv('create'))) {
        throw new HandlerError(`You should install ${APP_NAME} first!`)
      }
      if (!ensureDirectoryExist(TARGET_FOLDER)) {
        throw new HandlerError(
          `Failed to create @sxzz/create configuration folder: ${TARGET_FOLDER}`,
        )
      }
    },
    handler: createHandler(CONFIG_PATH_GENERATORS),
  }
}
