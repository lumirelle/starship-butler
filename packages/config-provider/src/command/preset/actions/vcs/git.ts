import type { Action, ConfigPathGenerator } from '../../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createHandler } from '../utils'

const APP_NAME = 'Git'

const TARGET_FOLDER = homedir()

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('vcs', 'git', '.gitconfig'),
    target: join(targetFolder, '.gitconfig'),
  }),
]

export function git(): Action {
  return {
    id: 'git',
    name: APP_NAME,
    targetFolder: TARGET_FOLDER,
    handler: createHandler(CONFIG_PATH_GENERATORS),
    posthandler: () => {
      consola.info(
        `This config use \`Neovim\` as editor for Git commit messages. If you don't want to use it, please edit this configuration \`(${join(TARGET_FOLDER, '.gitconfig')})\`.`,
      )
    },
  }
}
