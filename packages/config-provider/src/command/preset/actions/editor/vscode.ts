import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import consola from 'consola'
import { appdata, homedir, join } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, createTargetFolderHandler, ensureDirectoryExist, isPathExist } from '../utils'

const name = 'VSCode'

const platformTargetFolderMap: PlatformTargetFolderMap = {
  win32: appdata('Code', 'User'),
  linux: homedir('.config', 'Code', 'User'),
  darwin: homedir('Library', 'Application Support', 'Code', 'User'),
}

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
    source: join('editor', 'vscode', 'default', 'mcp.json'),
    target: join(targetFolder, 'mcp.json'),
  }),
  (targetFolder: string) => ({
    source: join('editor', 'vscode', 'default', 'global.code-snippets'),
    target: join(targetFolder, 'snippets', 'global.code-snippets'),
  }),
  (targetFolder: string) => ({
    source: join('editor', 'vscode', 'default', 'comment.code-snippets'),
    target: join(targetFolder, 'snippets', 'comment.code-snippets'),
  }),
]

export function vscode(): Action {
  return {
    id: 'vscode',
    name,
    targetFolder: createTargetFolderHandler(platformTargetFolderMap),
    prehandler: ({ targetFolder, systemOptions }) => {
      if (!(systemOptions.platform in platformTargetFolderMap))
        throw new HandlerError(`Unsupported platform: ${systemOptions.platform}`)
      if (!isPathExist(targetFolder))
        throw new HandlerError(`You should install ${name} first!`)
      if (!ensureDirectoryExist(join(targetFolder, 'snippets')))
        throw new HandlerError(`Failed to create snippets directory for ${name}!`)
    },
    handler: createHandler(configPathGenerators),
    posthandler: () => {
      consola.info('This configuration is meant to be used by `Visual Studio Code` in user scope.')
    },
  }
}
