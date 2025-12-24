import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { join } from 'pathe'
import { HandlerError } from '../../error'
import { appdata, homedir, isPathExist, processConfig } from '../utils'

const name = 'Clash Verge Rev'

const applicationId = 'io.github.clash-verge-rev.clash-verge-rev'

const platformTargetFolderMap: PlatformTargetFolderMap = {
  win32: appdata(applicationId, 'profiles'),
  linux: homedir('.local', 'shared', applicationId, 'profiles'),
  darwin: homedir('Library', 'Application Support', applicationId, 'profiles'),
}

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('network', 'clash-verge-rev', 'Script.js'),
    target: join(targetFolder, 'Script.js'),
  }),
]

export function clashVergeRev(): Action {
  return {
    id: 'clash-verge-rev',
    name,
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      return platformTargetFolderMap[platform] ?? ''
    },
    prehandler: ({ targetFolder }) => {
      // TODO: Is this check correct?
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
