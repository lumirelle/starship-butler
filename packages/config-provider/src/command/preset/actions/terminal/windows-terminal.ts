import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { HandlerError } from '../../error'
import { createHandler, isPathExist, localAppdata } from '../utils'

const name = 'Windows Terminal'

const applicationId = 'Microsoft.WindowsTerminal_8wekyb3d8bbwe'

const targetFolder = localAppdata('Packages', applicationId, 'LocalState')

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('terminal', 'windows-terminal', 'settings.json'),
    target: join(targetFolder, 'settings.json'),
  }),
]

export function windowsTerminal(): Action {
  return {
    id: 'windows-terminal',
    name,
    targetFolder,
    prehandler: ({ targetFolder, systemOptions }) => {
      if (systemOptions.platform !== 'win32')
        throw new HandlerError('Windows Terminal is only supported on Windows platform, you may never use it as you are not using Windows.')
      if (!isPathExist(targetFolder))
        throw new HandlerError(`You should install ${name} first!`)
    },
    handler: createHandler(configPathGenerators),
    posthandler: () => {
      consola.info('This configuration will use `"DM Mono", "Maple Mono CN", "Symbols Nerd Font"` as terminal fonts, "Nushell" as default shell and "Starship" as shell prompt. Don\'t forget to install them, or just exclude this preset if you want to use your own configuration!')
    },
  }
}
