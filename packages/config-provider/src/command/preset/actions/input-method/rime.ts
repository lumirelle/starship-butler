import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import consola from 'starship-butler-utils/consola'
import { appdata, homedir, join } from 'starship-butler-utils/path'
import { createHandler, createTargetFolderHandler, isPathExist } from '../utils'

const name = 'rime'

const platformTargetFolderMap: PlatformTargetFolderMap = {
  win32: appdata('Rime'),
  linux: homedir('.config', 'ibus', 'rime'),
  darwin: homedir('Library', 'Rime'),
}

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('input-method', 'rime', 'default.custom.yaml'),
    target: join(targetFolder, 'default.custom.yaml'),
  }),
  (targetFolder: string) => ({
    source: join('input-method', 'rime', 'wanxiang.custom.yaml'),
    target: join(targetFolder, 'wanxiang.custom.yaml'),
  }),
]

export function rime(): Action {
  return {
    id: 'rime',
    name,
    prehandler: ({ targetFolder, systemOptions }) => {
      if (!(systemOptions.platform in platformTargetFolderMap))
        throw new Error(`Unsupported platform: ${systemOptions.platform}`)
      if (!isPathExist(targetFolder))
        throw new Error(`You should install ${name} first!`)
    },
    targetFolder: createTargetFolderHandler(platformTargetFolderMap),
    handler: createHandler(configPathGenerators),
    posthandler: () => {
      consola.info('Currently, this configuration only supports `Rime official input` method with default user configuration folder path. For Linux users, please make sure you are using `ibus-rime`. After applying the configuration, don\'t forget to deploy Rime and wait for few seconds/minutes! Just with patience :)')
    },
  }
}
