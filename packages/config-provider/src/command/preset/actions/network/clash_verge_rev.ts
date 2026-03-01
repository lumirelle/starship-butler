import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { join } from 'pathe'
import { appdata, homedir } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, createTargetFolderHandler, isPathExist } from '../utils'

const APP_NAME = 'Clash Verge Rev'

const TARGET_FOLDERS: PlatformTargetFolderMap = (() => {
  const APP_ID = 'io.github.clash-verge-rev.clash-verge-rev'
  return {
    win32: appdata(APP_ID, 'profiles'),
    linux: homedir('.local', 'shared', APP_ID, 'profiles'),
    darwin: homedir('Library', 'Application Support', APP_ID, 'profiles'),
  }
})()

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('network', 'clash_verge_rev', 'Script.js'),
    target: join(targetFolder, 'Script.js'),
  }),
]

export function clashVergeRev(): Action {
  return {
    id: 'clash-verge-rev',
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
  }
}
