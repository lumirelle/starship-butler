import type { ActionFactory } from '../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createHandler } from '../utils'

export const git: ActionFactory = () => {
  return {
    id: 'git',
    name: 'Git',
    base: join('vcs', 'git'),
    destination: homedir(),
    handler: createHandler([
      createConfigPathGenerator('.gitconfig'),
    ]),
    posthandler: ({ destination }) => {
      consola.info(
        `This config use \`Neovim\` as editor for Git commit messages. If you don't want to use it, please edit this configuration \`(${join(destination, '.gitconfig')})\`.`,
      )
    },
  }
}
