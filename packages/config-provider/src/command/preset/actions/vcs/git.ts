import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createHandler } from '../utils'

const name = 'Git'

const targetFolder = homedir()

const configPathGenerators: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('vcs', 'git', '.gitconfig'),
    target: join(targetFolder, '.gitconfig'),
  }),
]

export function git(): Action {
  return {
    id: 'git',
    name,
    targetFolder,
    handler: createHandler(configPathGenerators),
    posthandler: () => {
      consola.info(`This config use \`Neovim\` as editor for Git commit messages. If you don't want to use it, please edit this configuration \`(${join(targetFolder, '.gitconfig')})\`.`)
    },
  }
}
