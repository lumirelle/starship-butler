import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir, localAppdata } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import {
  createHandler,
  createTargetFolderHandler,
  ensureDirectoryExist,
  isPathExist,
} from '../utils'

const APP_NAME = 'Neo Vim'

const TARGET_FOLDERS: PlatformTargetFolderMap = {
  win32: localAppdata('nvim'),
  linux: homedir('.config', 'nvim'),
  darwin: homedir('.config', 'nvim'),
}

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
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
    source: join('editor', 'nvim', 'lua', 'plugins', 'multicursor.lua'),
    target: join(targetFolder, 'lua', 'plugins', 'multicursor.lua'),
  }),
  ({ targetFolder }) => ({
    source: join('editor', 'nvim', 'lua', 'plugins', 'vscode_multi_cursor.lua'),
    target: join(targetFolder, 'lua', 'plugins', 'vscode_multi_cursor.lua'),
  }),
]

export function neovim(): Action {
  return {
    id: 'nvim',
    name: APP_NAME,
    targetFolder: createTargetFolderHandler(TARGET_FOLDERS),
    prehandler: ({ targetFolder, systemOptions }) => {
      if (!(systemOptions.platform in TARGET_FOLDERS)) {
        throw new HandlerError(`Unsupported platform: ${systemOptions.platform}`)
      }
      if (!isPathExist([targetFolder, join(targetFolder, 'lazyvim.json')])) {
        throw new HandlerError(`You should install ${APP_NAME} and LazyVim first!`)
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
    handler: createHandler(CONFIG_PATH_GENERATORS),
    posthandler: () => {
      consola.info(
        'This configuration is meant to be used by `NeoVim` installed in user scope and default path with LazyVim.',
      )
    },
  }
}
