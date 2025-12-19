import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { join } from 'pathe'
import { homedir, isPathExist, localAppdata, processConfig } from '../utils'

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
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      return platformTargetFolderMap[platform] ?? ''
    },
    prehandler: ({ targetFolder }) => {
      // TODO: Is this check correct?
      if (!isPathExist(
        [targetFolder, join(targetFolder, 'lazyvim.json')],
        `You should install ${name} and Lazy Vim first!`,
      )) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      for (const generator of configPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
  }
}
