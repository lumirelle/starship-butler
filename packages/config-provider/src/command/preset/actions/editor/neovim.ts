import type { ActionFactory } from '../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir, localAppdata } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import {
  createConfigPathGenerator,
  createDestinationHandler,
  createHandler,
  ensureDirectoryExist,
  isPathExist,
} from '../utils'

export const neovim: ActionFactory = () => {
  return {
    id: 'nvim',
    name: 'Neo Vim',
    base: join('editor', 'nvim'),
    destination: createDestinationHandler({
      win32: localAppdata('nvim'),
      linux: homedir('.config', 'nvim'),
      darwin: homedir('.config', 'nvim'),
    }),
    prehandler: ({ destination: targetFolder, name }) => {
      // FIXME(Lumirelle): Better prehandler?
      if (!isPathExist([targetFolder, join(targetFolder, 'lazyvim.json')])) {
        throw new HandlerError(`You should install ${name} and LazyVim first!`)
      }
      const luaConfigDir = join(targetFolder, 'lua', 'config')
      if (!ensureDirectoryExist(luaConfigDir)) {
        throw new HandlerError(`Failed to create Lua config directory: ${luaConfigDir}`)
      }
      const luaPluginsDir = join(targetFolder, 'lua', 'plugins')
      if (!ensureDirectoryExist(luaPluginsDir)) {
        throw new HandlerError(
          `Failed to create Lua plugins directory: ${join(targetFolder, 'lua', 'plugins')}`,
        )
      }
    },
    handler: createHandler([
      createConfigPathGenerator('init.lua'),
      createConfigPathGenerator(join('lua', 'config', 'autocmds.lua')),
      createConfigPathGenerator(join('lua', 'config', 'autocmds_vscode.lua')),
      createConfigPathGenerator(join('lua', 'config', 'keymaps.lua')),
      createConfigPathGenerator(join('lua', 'config', 'keymaps_vscode.lua')),
      createConfigPathGenerator(join('lua', 'config', 'keymaps_not_vscode.lua')),
      createConfigPathGenerator(join('lua', 'config', 'options.lua')),
      createConfigPathGenerator(join('lua', 'plugins', 'multicursor.lua')),
      createConfigPathGenerator(join('lua', 'plugins', 'vscode_multi_cursor.lua')),
    ]),
    posthandler: () => {
      consola.info('This configuration is meant to be used by `NeoVim` installed in user scope and default path with LazyVim.')
    },
  }
}
