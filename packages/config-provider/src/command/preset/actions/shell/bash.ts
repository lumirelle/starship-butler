import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'starship-butler-utils/consola'
import { homedir, join } from 'starship-butler-utils/path'
import { createHandler } from '../utils'

const name = 'Bash'

const targetFolder = homedir()

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('shell', 'bash', '.bash_profile'),
    target: join(targetFolder, '.bash_profile'),
  }),
]

export function bash(): Action {
  return {
    id: 'bash',
    name,
    targetFolder,
    handler: createHandler(configPathGenerators),
    posthandler: ({ targetFolder }) => {
      consola.info(`This configuration will use \`Starship\` as the prompt, if you don't want to use it, please edit this config \`(${join(targetFolder, '.bash_profile')})\` manually.`)
    },
  }
}
