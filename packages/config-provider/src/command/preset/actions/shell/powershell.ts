import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { HandlerError } from '../../error'
import { ensureDirectoryExist, homedir, isPathExistEnv, processConfig } from '../utils'

const name = 'PowerShell'

const platformTargetFolderMap: PlatformTargetFolderMap = {
  win32: homedir('Documents', 'PowerShell'),
  linux: homedir('.config', 'powershell'),
  darwin: homedir('.config', 'powershell'),
}

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('shell', 'pwsh', 'profile.ps1'),
    target: join(targetFolder, 'profile.ps1'),
  }),
]

export function powershell(): Action {
  return {
    id: 'powershell',
    name,
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      return platformTargetFolderMap[platform] ?? ''
    },
    prehandler: async ({ targetFolder }) => {
      if (!(await isPathExistEnv('pwsh')))
        throw new HandlerError(`You should install ${name} first and add it to your system's PATH environment variable!`)
      if (!ensureDirectoryExist(targetFolder))
        throw new HandlerError(`Failed to ensure directory exists: ${targetFolder}`)
    },
    handler: async ({ options, targetFolder }) => {
      for (const generator of configPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
    posthandler: () => {
      consola.info('Please running `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` to allow local scripts!')
    },
  }
}
