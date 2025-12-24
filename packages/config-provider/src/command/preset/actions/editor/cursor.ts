import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import consola from 'consola'
import { appdata, homedir, join } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, createTargetFolderHandler, ensureDirectoryExist, isPathExist } from '../utils'

const name = 'Cursor'

const platformTargetFolderMap: PlatformTargetFolderMap = {
  win32: appdata('Cursor', 'User'),
  linux: homedir('.config', 'Cursor', 'User'),
  darwin: homedir('Library', 'Application Support', 'Cursor', 'User'),
}

const mcpTargetFolder = homedir('.cursor')

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('editor', 'vscode', 'default', 'keybindings.json'),
    target: join(targetFolder, 'keybindings.json'),
  }),
  (targetFolder: string) => ({
    source: join('editor', 'vscode', 'default', 'settings.json'),
    target: join(targetFolder, 'settings.json'),
  }),
  (targetFolder: string) => ({
    source: join('editor', 'vscode', 'default', 'global.code-snippets'),
    target: join(targetFolder, 'snippets', 'global.code-snippets'),
  }),
  (targetFolder: string) => ({
    source: join('editor', 'vscode', 'default', 'comment.code-snippets'),
    target: join(targetFolder, 'snippets', 'comment.code-snippets'),
  }),
  () => ({
    source: join('editor', 'vscode', 'default', 'mcp.json'),
    target: join(mcpTargetFolder, 'mcp.json'),
  }),
]

export function cursor(): Action {
  return {
    id: 'cursor',
    name: 'Cursor',
    targetFolder: createTargetFolderHandler(platformTargetFolderMap),
    prehandler: ({ targetFolder, systemOptions }) => {
      if (!(systemOptions.platform in platformTargetFolderMap))
        throw new HandlerError(`Unsupported platform: ${systemOptions.platform}`)
      if (!isPathExist(targetFolder))
        throw new HandlerError(`You should install ${name} first!`)
      const snippetsFolder = join(targetFolder, 'snippets')
      if (!ensureDirectoryExist(snippetsFolder))
        throw new HandlerError(`Failed to create snippets folder: ${snippetsFolder}`)
      if (!ensureDirectoryExist(mcpTargetFolder))
        throw new HandlerError(`Failed to create MCP folder: ${mcpTargetFolder}`)
    },
    handler: createHandler(configPathGenerators),
    posthandler: () => {
      consola.info('This configuration is meant to be used by `Cursor` in user scope.')
    },
  }
}
