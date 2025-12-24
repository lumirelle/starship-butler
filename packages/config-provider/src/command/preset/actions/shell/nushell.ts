import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { join } from 'pathe'
import { HandlerError } from '../../error'
import { appdata, homedir, isPathExist, processConfig } from '../utils'

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
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      return platformTargetFolderMap[platform] ?? ''
    },
    prehandler: ({ targetFolder }) => {
      // TODO(Lumirelle): Is this check correct?
      if (!isPathExist(targetFolder))
        throw new HandlerError(`You should install ${name} first!`)
    },
    handler: async ({ options, targetFolder }) => {
      for (const generator of configPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
  }
}
