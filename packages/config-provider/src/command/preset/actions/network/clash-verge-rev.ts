import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { appdata, homedir, join } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, createTargetFolderHandler, isPathExist } from '../utils'

const name = 'Clash Verge Rev'

const applicationId = 'io.github.clash-verge-rev.clash-verge-rev'

const platformTargetFolderMap: PlatformTargetFolderMap = {
  win32: appdata(applicationId, 'profiles'),
  linux: homedir('.local', 'shared', applicationId, 'profiles'),
  darwin: homedir('Library', 'Application Support', applicationId, 'profiles'),
}

const configPathGenerators: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('network', 'clash-verge-rev', 'Script.js'),
    target: join(targetFolder, 'Script.js'),
  }),
]

export function clashVergeRev(): Action {
  return {
    id: 'clash-verge-rev',
    name,
    targetFolder: createTargetFolderHandler(platformTargetFolderMap),
    prehandler: ({ targetFolder, systemOptions }) => {
      if (!(systemOptions.platform in platformTargetFolderMap))
        throw new HandlerError(`Unsupported platform: ${systemOptions.platform}`)
      if (!isPathExist(targetFolder))
        throw new HandlerError(`You should install ${name} first!`)
    },
    handler: createHandler(configPathGenerators),
  }
}
