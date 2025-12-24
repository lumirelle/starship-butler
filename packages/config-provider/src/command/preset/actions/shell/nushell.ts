import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { join } from 'pathe'
import { HandlerError } from '../../error'
import { appdata, createHandler, createTargetFolderHandler, homedir, isPathExist } from '../utils'

const name = 'Nushell'

const applicationId = 'nushell'

const platformTargetFolderMap: PlatformTargetFolderMap = {
  win32: appdata(applicationId),
  linux: homedir('.config', applicationId),
  darwin: homedir('Library', 'Application Support', applicationId),
}

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('shell', 'nu', 'utils.nu'),
    target: join(targetFolder, 'utils.nu'),
  }),
  (targetFolder: string) => ({
    source: join('shell', 'nu', 'config.nu'),
    target: join(targetFolder, 'config.nu'),
  }),
  (targetFolder: string) => ({
    source: join('shell', 'nu', 'env.nu'),
    target: join(targetFolder, 'env.nu'),
  }),
]

export function nushell(): Action {
  return {
    id: 'nushell',
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
