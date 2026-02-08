import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { homedir, localAppdata } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, createTargetFolderHandler, ensureDirectoryExist, isPathExist } from '../utils'

const name = 'Neo Vim'

const platformTargetFolderMap: PlatformTargetFolderMap = {
  win32: localAppdata('nvim'),
  linux: homedir('.config', 'nvim'),
  darwin: homedir('.config', 'nvim'),
}

const configPathGenerators: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('editor', 'nvim', 'init.lua'),
    target: join(targetFolder, 'init.lua'),
  }),
  ({ targetFolder }) => ({
    source: join('editor', 'nvim', 'lua', 'config', 'autocmds.lua'),
    target: join(targetFolder, 'lua', 'config', 'autocmds.lua'),
  }),
  ({ targetFolder }) => ({
    source: join('editor', 'nvim', 'lua', 'config', 'autocmds_vscode.lua'),
    target: join(targetFolder, 'lua', 'config', 'autocmds_vscode.lua'),
  }),
  ({ targetFolder }) => ({
    source: join('editor', 'nvim', 'lua', 'config', 'keymaps.lua'),
    target: join(targetFolder, 'lua', 'config', 'keymaps.lua'),
  }),
  ({ targetFolder }) => ({
    source: join('editor', 'nvim', 'lua', 'config', 'keymaps_vscode.lua'),
    target: join(targetFolder, 'lua', 'config', 'keymaps_vscode.lua'),
  }),
  ({ targetFolder }) => ({
    source: join('editor', 'nvim', 'lua', 'config', 'options.lua'),
    target: join(targetFolder, 'lua', 'config', 'options.lua'),
  }),
  ({ targetFolder }) => ({
    source: join('editor', 'nvim', 'lua', 'plugins', 'vscode_multi_cursor.lua'),
    target: join(targetFolder, 'lua', 'plugins', 'vscode_multi_cursor.lua'),
  }),
]

export function neovim(): Action {
  return {
    id: 'nvim',
    name,
    targetFolder: createTargetFolderHandler(platformTargetFolderMap),
    prehandler: ({ targetFolder, systemOptions }) => {
      if (!(systemOptions.platform in platformTargetFolderMap))
        throw new HandlerError(`Unsupported platform: ${systemOptions.platform}`)
      if (!isPathExist([targetFolder, join(targetFolder, 'lazyvim.json')]))
        throw new HandlerError(`You should install ${name} and LazyVim first!`)
      const luaConfigDir = join(targetFolder, 'lua', 'config')
      if (!ensureDirectoryExist(luaConfigDir))
        throw new HandlerError(`Failed to create Lua config directory: ${luaConfigDir}`)
      const luaPluginsDir = join(targetFolder, 'lua', 'plugins')
      if (!ensureDirectoryExist(luaPluginsDir))
        throw new HandlerError(`Failed to create Lua plugins directory: ${join(targetFolder, 'lua', 'plugins')}`)
    },
    handler: createHandler(configPathGenerators),
    posthandler: () => {
      consola.info('This configuration is meant to be used by `NeoVim` installed in user scope and default path with LazyVim.')
    },
  }
}
