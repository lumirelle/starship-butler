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

export const cursor: ActionFactory = () => {
  return {
    id: 'cursor',
    name: 'Cursor',
    base: join('editor', 'vscode', 'default'),
    destination: createDestinationHandler({
      win32: appdata('Cursor', 'User'),
      linux: homedir('.config', 'Cursor', 'User'),
      darwin: homedir('Library', 'Application Support', 'Cursor', 'User'),
    }),
    prehandler: ({ destination, name }) => {
      // FIXME(Lumirelle): Better prehandler?
      if (!isPathExist(destination)) {
        throw new HandlerError(`You should install ${name} first!`)
      }
      const snippetsFolder = join(destination, 'snippets')
      if (!ensureDirectoryExist(snippetsFolder)) {
        throw new HandlerError(`Failed to create snippets folder ${snippetsFolder} for ${name}!`)
      }
    },
    handler: createHandler([
      createConfigPathGenerator('keybindings.json'),
      createConfigPathGenerator('settings.json'),
      createConfigPathGenerator('global.code-snippets', join('snippets', 'global.code-snippets')),
      createConfigPathGenerator('comment.code-snippets', join('snippets', 'comment.code-snippets')),
    ]),
    posthandler: () => {
      consola.info('This configuration is meant to be used by `Cursor` installed in user scope and default path.')
      consola.info('It uses with many opinionated preset: custom fonts, `Neovim` extension, `podman` integration, etc.')
    },
  }
}
