import type { ActionFactory } from '../types'
import process from 'node:process'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createHandler, createPrehandler } from '../utils'

export const windowsPowerShell: ActionFactory = () => {
  if (process.platform !== 'win32')
    return
  return {
    id: 'windows-powershell',
    name: 'Windows PowerShell',
    base: join('shell', 'pwsh'),
    destination: homedir('Documents', 'WindowsPowerShell'),
    prehandler: createPrehandler('env-exist', { executable: 'powershell' }),
    handler: createHandler([
      createConfigPathGenerator('profile.ps1', 'Microsoft.PowerShell_profile.ps1'),
    ]),
    posthandler: ({ destination }) => {
      consola.info(
        `Please running \`Set-ExecutionPolicy RemoteSigned -Scope CurrentUser\` to allow local scripts! This configuration will use \`Starship\` as the prompt, if you don't want to use it, please edit this config \`(${join(destination, 'Microsoft.PowerShell_profile.ps1')})\` manually.`,
      )
    },
  }
}
