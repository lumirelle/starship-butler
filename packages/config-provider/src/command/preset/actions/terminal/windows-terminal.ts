import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { HandlerError } from '../../error'
import { isPathExist, localAppdata, processConfig } from '../utils'

const name = 'Windows Terminal'

const applicationId = 'Microsoft.WindowsTerminal_8wekyb3d8bbwe'

/**
 * Windows only.
 */
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
    prehandler: ({ targetFolder }) => {
      if (!isPathExist(targetFolder))
        throw new HandlerError(`You should install ${name} first!`)
    },
    handler: async ({ options, targetFolder }) => {
      for (const generator of configPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
    posthandler: () => {
      consola.info('This configuration will use `"DM Mono", "Maple Mono CN", "Symbols Nerd Font"` as terminal fonts, "Nushell" as default shell and "Starship" as shell prompt. Don\'t forget to install them, or just exclude this preset if you want to use your own configuration!')
    },
  }
}
