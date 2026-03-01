import type { Action, ConfigPathGenerator } from '../../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, ensureDirectoryExist } from '../utils'

const APP_NAME = 'Starship'

const TARGET_FOLDER = homedir('.config')

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('shell_prompt', 'starship', 'starship.toml'),
    target: join(targetFolder, 'starship.toml'),
  }),
]

export function starship(): Action {
  return {
    id: 'starship',
    name: APP_NAME,
    targetFolder: TARGET_FOLDER,
    prehandler: ({ targetFolder }) => {
      // As Starship is necessary to my shells' configuration, so we ensure it's configurations are always usable.
      if (!ensureDirectoryExist(targetFolder)) {
        throw new HandlerError(`Failed to create Starship configuration folder: ${targetFolder}`)
      }
    },
    handler: createHandler(CONFIG_PATH_GENERATORS),
    posthandler: () => {
      consola.info('Nerd Fonts is required to display all icons correctly in Starship prompt.')
    },
  }
}
