import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'starship-butler-utils/consola'
import { homedir, join } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, ensureDirectoryExist } from '../utils'

const name = 'Windows PowerShell'

const targetFolder = homedir('Documents', 'WindowsPowerShell')

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('shell', 'pwsh', 'profile.ps1'),
    target: join(targetFolder, 'Microsoft.PowerShell_profile.ps1'),
  }),
]

export function windowsPowerShell(): Action {
  return {
    id: 'windows-powershell',
    name,
    targetFolder,
    prehandler: ({ systemOptions, targetFolder }) => {
      // Return false for non-win32 platform
      if (systemOptions.platform !== 'win32')
        throw new HandlerError('Windows PowerShell is the legacy version of PowerShell and bundled in Windows, you may never use it as you are not using Windows.')
      // Ensure directory exist
      if (!ensureDirectoryExist(targetFolder))
        throw new HandlerError(`Failed to create Windows PowerShell profile folder: ${targetFolder}`)
    },
    handler: createHandler(configPathGenerators),
    posthandler: () => {
      consola.info(`Please running \`Set-ExecutionPolicy RemoteSigned -Scope CurrentUser\` to allow local scripts! This configuration will use \`Starship\` as the prompt, if you don't want to use it, please edit this config \`(${join(targetFolder, 'Microsoft.PowerShell_profile.ps1')})\` manually.`)
    },
  }
}
