import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'starship-butler-utils/consola'
import { join, localAppdata } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, isPathExist } from '../utils'

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
    posthandler: ({ targetFolder }) => {
      consola.info(`This configuration will use \`'"Recursive Mono Linear", "Maple Mono CN", "Symbols Nerd Font"'\` as terminal fonts, \`Nushell\` as default shell. If you don't want to use them, please edit this config \`(${join(targetFolder, 'settings.json')})\` manually.`)
    },
  }
}
