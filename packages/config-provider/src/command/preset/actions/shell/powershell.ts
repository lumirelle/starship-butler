import type { ActionFactory } from '../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import {
  createConfigPathGenerator,
  createDestinationHandler,
  createHandler,
  createPrehandler,
} from '../utils'

export const powershell: ActionFactory = () => {
  return {
    id: 'powershell',
    name: 'PowerShell',
    base: join('shell', 'pwsh'),
    destination: createDestinationHandler({
      win32: homedir('Documents', 'PowerShell'),
      linux: homedir('.config', 'powershell'),
      darwin: homedir('.config', 'powershell'),
    }),
    prehandler: createPrehandler('env-exist', { executable: 'pwsh' }),
    handler: createHandler([
      createConfigPathGenerator('profile.ps1'),
      createConfigPathGenerator('powershell.config.json'),
    ]),
    posthandler: ({ destination }) => {
      consola.info(
        `This configuration will use \`Starship\` as the prompt, if you don't want to use it, please edit this config \`(${join(destination, 'profile.ps1')})\` manually, or consider not to include this action.`,
      )
    },
  }
}
