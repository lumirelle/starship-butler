import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { appdata, homedir, isPathExist, processConfig } from '../utils'

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
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      return platformTargetFolderMap[platform] ?? ''
    },
    prehandler: ({ targetFolder }) => {
      // TODO: Is this check correct?
      if (!isPathExist(targetFolder, `You should install ${name} first!`))
        return false
      return true
    },
    handler: async ({ options, targetFolder }) => {
      for (const generator of configPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
    posthandler: () => {
      consola.info('This configuration is meant to be used by `Zed` in user scope.')
    },
  }
}
