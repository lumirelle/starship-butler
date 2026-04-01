import type { ActionFactory } from '../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { ensureDirectory, exists } from 'starship-butler-utils/fs'
import { homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createHandler } from '../utils'

export const git: ActionFactory = () => {
  const configGitcloneinitExist = exists(homedir('.gitcloneinit'))
  return {
    id: 'git',
    name: 'Git',
    base: join('vcs', 'git'),
    destination: homedir(),
    prehandler: ({ destination, name }) => {
      // FIXME(Lumirelle): Better prehandler?
      const hooksFolder = join(destination, '.config', 'git', 'templates', 'hooks')
      if (!ensureDirectory(hooksFolder)) {
        throw new Error(`Failed to create hooks folder ${hooksFolder} for ${name}!`)
      }
    },
    handler: createHandler([
      createConfigPathGenerator('.gitconfig'),
      createConfigPathGenerator('post-checkout', join('.config', 'git', 'templates', 'hooks', 'post-checkout')),
      // Only create the file if it does not exist, to avoid overwriting user config.
      !configGitcloneinitExist && createConfigPathGenerator('.gitcloneinit'),
    ]),
    posthandler: ({ destination }) => {
      consola.info(
        `This config use \`Neovim\` as editor for Git commit messages. If you don't want to use it, please edit this configuration \`(${join(destination, '.gitconfig')})\`.`,
      )
      if (configGitcloneinitExist) {
        consola.info(
          `Skipping \`${join(destination, '.gitcloneinit')}\` file since it already exists in the home directory. You can edit this file to customize the git user information when cloning repositories.`,
        )
      }
      else {
        consola.info(
          `The \`${join(destination, '.gitcloneinit')}\` file is used to initialize your user information, which will be set when you clone a repository with Git, based the original url. Don't forget to edit this file!`,
        )
      }
    },
  }
}
