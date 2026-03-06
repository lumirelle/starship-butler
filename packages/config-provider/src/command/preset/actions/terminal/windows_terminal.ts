import type { Action, ConfigPathGenerator } from '../../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { localAppdata } from 'starship-butler-utils/path'
import { createHandler, isPathExist } from '../../actions/utils'
import { HandlerError } from '../../error'

const APP_NAME = 'Windows Terminal'

const TARGET_FOLDER = localAppdata(
  'Packages',
  'Microsoft.WindowsTerminal_8wekyb3d8bbwe',
  'LocalState',
)

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('terminal', 'windows_terminal', 'settings.json'),
    target: join(targetFolder, 'settings.json'),
  }),
]

export function windowsTerminal(): Action {
  return {
    id: 'windows-terminal',
    name: APP_NAME,
    targetFolder: TARGET_FOLDER,
    prehandler: ({ targetFolder, systemOptions }) => {
      if (systemOptions.platform !== 'win32') {
        throw new HandlerError(
          'Windows Terminal is only supported on Windows platform, you may never use it as you are not using Windows.',
        )
      }
      if (!isPathExist(targetFolder)) {
        throw new HandlerError(`You should install ${APP_NAME} first!`)
      }
    },
    handler: createHandler(CONFIG_PATH_GENERATORS),
    posthandler: ({ targetFolder }) => {
      consola.info(
        `This configuration will use \`'"Geist Mono", "Maple Mono CN", "Symbols Nerd Font"'\` as terminal fonts, \`Nushell\` as default shell. If you don't want to use them, please edit this config \`(${join(targetFolder, 'settings.json')})\` manually.`,
      )
    },
  }
}
