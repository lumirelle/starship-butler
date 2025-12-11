import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { ensureDirectoryExist, homedir, processConfig } from '../utils'

const name = 'Starship'

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('shell-prompt', 'starship', 'starship.toml'),
    target: join(targetFolder, 'starship.toml'),
  }),
]

export function starship(): Action {
  return {
    id: 'starship',
    name,
    targetFolder: homedir('.config'),
    prehandler: ({ targetFolder }) => {
      // As Starship is necessary to my shells' configuration, so we ensure it's configurations are always usable.
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
      consola.info('Nerd Fonts is required to display all icons correctly in Starship prompt.')
    },
  }
}
