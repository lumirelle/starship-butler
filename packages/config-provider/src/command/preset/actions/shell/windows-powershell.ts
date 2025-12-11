import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { ensureDirectoryExist, homedir, processConfig } from '../utils'

const name = 'Windows PowerShell'

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
    targetFolder: homedir('Documents', 'WindowsPowerShell'),
    prehandler: ({ systemOptions, targetFolder }) => {
      const { platform } = systemOptions
      // Return false for non-win32 platform
      if (platform !== 'win32') {
        consola.warn('Windows PowerShell is the legacy version of PowerShell and bundled in Windows, you may never use it as you are not using Windows, so we will skip this preset.')
        return false
      }
      // Ensure directory exist
      if (!ensureDirectoryExist(targetFolder))
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
      consola.info('Please running `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` to allow local scripts!')
    },
  }
}
