import type { ActionFactory } from '../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { appdata, homedir } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import {
  createConfigPathGenerator,
  createDestinationHandler,
  createHandler,
  ensureDirectoryExist,
  isPathExist,
} from '../utils'

export const vscode: ActionFactory = () => {
  return {
    id: 'vscode',
    name: 'VSCode',
    base: join('editor', 'vscode', 'default'),
    destination: createDestinationHandler({
      win32: appdata('Code', 'User'),
      linux: homedir('.config', 'Code', 'User'),
      darwin: homedir('Library', 'Application Support', 'Code', 'User'),
    }),
    prehandler: ({ destination, name }) => {
      // FIXME(Lumirelle): Better prehandler?
      if (!isPathExist(destination))
        throw new HandlerError(`You should install and open ${name} one time first!`)
      const snippetsFolder = join(destination, 'snippets')
      if (!ensureDirectoryExist(snippetsFolder))
        throw new HandlerError(`Failed to create snippets directory ${snippetsFolder} for ${name}!`)
    },
    handler: createHandler([
      createConfigPathGenerator('keybindings.json'),
      createConfigPathGenerator('settings.json'),
      createConfigPathGenerator('global.code-snippets', join('snippets', 'global.code-snippets')),
      createConfigPathGenerator('comment.code-snippets', join('snippets', 'comment.code-snippets')),
    ]),
    posthandler: () => {
      consola.info('This configuration uses with many opinionated preset: custom fonts, `Neovim` extension, `podman` integration, etc.')
    },
  }
}
