import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { appdata, homedir } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, createTargetFolderHandler, isPathExist } from '../utils'

const name = 'Nushell'

const applicationId = 'nushell'

const platformTargetFolderMap: PlatformTargetFolderMap = {
  win32: appdata(applicationId),
  linux: homedir('.config', applicationId),
  darwin: homedir('Library', 'Application Support', applicationId),
}

const configPathGenerators: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('shell', 'nu', 'utils.nu'),
    target: join(targetFolder, 'utils.nu'),
  }),
  ({ targetFolder }) => ({
    source: join('shell', 'nu', 'config.nu'),
    target: join(targetFolder, 'config.nu'),
  }),
  ({ targetFolder }) => ({
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
    posthandler: ({ targetFolder }) => {
      consola.info(`This configuration will use \`Starship\` as the prompt, if you don't want to use it, please edit this config \`(${join(targetFolder, 'config.nu')})\` manually.`)
    },
  }
}
