import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { join } from 'pathe'
import { HandlerError } from '../../error'
import { createHandler, createTargetFolderHandler, ensureDirectoryExist, homedir, isPathExist, localAppdata } from '../utils'

const name = 'Neo Vim'

const platformTargetFolderMap: PlatformTargetFolderMap = {
  win32: localAppdata('nvim'),
  linux: homedir('.config', 'nvim'),
  darwin: homedir('.config', 'nvim'),
}

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('editor', 'nvim', 'init.lua'),
    target: join(targetFolder, 'init.lua'),
  }),
  (targetFolder: string) => ({
    source: join('editor', 'nvim', 'lua', 'config', 'autocmds.lua'),
    target: join(targetFolder, 'lua', 'config', 'autocmds.lua'),
  }),
  (targetFolder: string) => ({
    source: join('editor', 'nvim', 'lua', 'config', 'autocmds_vscode.lua'),
    target: join(targetFolder, 'lua', 'config', 'autocmds_vscode.lua'),
  }),
  (targetFolder: string) => ({
    source: join('editor', 'nvim', 'lua', 'config', 'keymaps.lua'),
    target: join(targetFolder, 'lua', 'config', 'keymaps.lua'),
  }),
  (targetFolder: string) => ({
    source: join('editor', 'nvim', 'lua', 'config', 'keymaps_vscode.lua'),
    target: join(targetFolder, 'lua', 'config', 'keymaps_vscode.lua'),
  }),
  (targetFolder: string) => ({
    source: join('editor', 'nvim', 'lua', 'config', 'options.lua'),
    target: join(targetFolder, 'lua', 'config', 'options.lua'),
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
    },
    handler: createHandler(configPathGenerators),
  }
}
