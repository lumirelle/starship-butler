import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, ensureDirectoryExist } from '../utils'

const name = 'Starship'

const targetFolder = homedir('.config')

const configPathGenerators: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('shell_prompt', 'starship', 'starship.toml'),
    target: join(targetFolder, 'starship.toml'),
  }),
]

export function starship(): Action {
  return {
    id: 'starship',
    name,
    targetFolder,
    prehandler: ({ targetFolder }) => {
      // As Starship is necessary to my shells' configuration, so we ensure it's configurations are always usable.
      if (!ensureDirectoryExist(targetFolder))
        throw new HandlerError(`Failed to create Starship configuration folder: ${targetFolder}`)
    },
    handler: createHandler(configPathGenerators),
    posthandler: () => {
      consola.info('Nerd Fonts is required to display all icons correctly in Starship prompt.')
    },
  }
}
