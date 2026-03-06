import type { Action, ConfigPathGenerator } from '../../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createHandler } from '../../actions/utils'

const APP_NAME = 'Bash'

const TARGET_FOLDER = homedir()

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('shell', 'bash', '.bash_profile'),
    target: join(targetFolder, '.bash_profile'),
  }),
]

export function bash(): Action {
  return {
    id: 'bash',
    name: APP_NAME,
    targetFolder: TARGET_FOLDER,
    handler: createHandler(CONFIG_PATH_GENERATORS),
    posthandler: ({ targetFolder }) => {
      consola.info(
        `This configuration will use \`Starship\` as the prompt, if you don't want to use it, please edit this config \`(${join(targetFolder, '.bash_profile')})\` manually.`,
      )
    },
  }
}
