import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { appdata, homedir } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, createTargetFolderHandler, isPathExist } from '../utils'

const APP_NAME = 'Zed'

const TARGET_FOLDERS: PlatformTargetFolderMap = {
  win32: appdata('Zed'),
  linux: homedir('.config', 'Zed'),
  darwin: homedir('Library', 'Application Support', 'Zed'),
}

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('editor', 'zed', 'settings.json'),
    target: join(targetFolder, 'settings.json'),
  }),
]

export function zed(): Action {
  return {
    id: 'zed',
    name: APP_NAME,
    targetFolder: createTargetFolderHandler(TARGET_FOLDERS),
    prehandler: ({ targetFolder, systemOptions }) => {
      if (!(systemOptions.platform in TARGET_FOLDERS)) {
        throw new HandlerError(`Unsupported platform: ${systemOptions.platform}`)
      }
      if (!isPathExist(targetFolder)) {
        throw new HandlerError(`You should install ${APP_NAME} first!`)
      }
    },
    handler: createHandler(CONFIG_PATH_GENERATORS),
    posthandler: () => {
      consola.info(
        'This configuration is meant to be used by `Zed` installed in user scope and default path.',
      )
    },
  }
}
