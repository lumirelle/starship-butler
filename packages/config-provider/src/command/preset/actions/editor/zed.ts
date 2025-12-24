import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { HandlerError } from '../../error'
import { appdata, createHandler, createTargetFolderHandler, homedir, isPathExist } from '../utils'

const name = 'Zed'

const platformTargetFolderMap: PlatformTargetFolderMap = {
  win32: appdata('Zed'),
  linux: homedir('.config', 'Zed'),
  darwin: homedir('Library', 'Application Support', 'Zed'),
}

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('editor', 'zed', 'settings.json'),
    target: join(targetFolder, 'settings.json'),
  }),
]

export function zed(): Action {
  return {
    id: 'zed',
    name,
    targetFolder: createTargetFolderHandler(platformTargetFolderMap),
    prehandler: ({ targetFolder, systemOptions }) => {
      if (!(systemOptions.platform in platformTargetFolderMap))
        throw new HandlerError(`Unsupported platform: ${systemOptions.platform}`)
      if (!isPathExist(targetFolder))
        throw new HandlerError(`You should install ${name} first!`)
    },
    handler: createHandler(configPathGenerators),
    posthandler: () => {
      consola.info('This configuration is meant to be used by `Zed` in user scope.')
    },
  }
}
