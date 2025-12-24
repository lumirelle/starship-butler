import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import consola from 'starship-butler-utils/consola'
import { homedir, join } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, createTargetFolderHandler, ensureDirectoryExist, isPathExistEnv } from '../utils'

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
    targetFolder: createTargetFolderHandler(platformTargetFolderMap),
    prehandler: async ({ targetFolder }) => {
      if (!(await isPathExistEnv('pwsh')))
        throw new HandlerError(`You should install ${name} first and add it to your system's PATH environment variable!`)
      if (!ensureDirectoryExist(targetFolder))
        throw new HandlerError(`Failed to create PowerShell profile folder: ${targetFolder}`)
    },
    handler: createHandler(configPathGenerators),
    posthandler: () => {
      consola.info('Please running `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` to allow local scripts!')
    },
  }
}
