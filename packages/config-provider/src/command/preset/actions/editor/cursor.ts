import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { appdata, homedir } from 'starship-butler-utils/path'
import {
  createHandler,
  createTargetFolderHandler,
  ensureDirectoryExist,
  isPathExist,
} from '../../actions/utils'
import { HandlerError } from '../../error'

const APP_NAME = 'Cursor'

const TARGET_FOLDERS: PlatformTargetFolderMap = {
  win32: appdata('Cursor', 'User'),
  linux: homedir('.config', 'Cursor', 'User'),
  darwin: homedir('Library', 'Application Support', 'Cursor', 'User'),
}
const MCP_TARGET_FOLDER = homedir('.cursor')

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('editor', 'vscode', 'default', 'keybindings.json'),
    target: join(targetFolder, 'keybindings.json'),
  }),
  ({ targetFolder }) => ({
    source: join('editor', 'vscode', 'default', 'settings.json'),
    target: join(targetFolder, 'settings.json'),
  }),
  ({ targetFolder }) => ({
    source: join('editor', 'vscode', 'default', 'global.code-snippets'),
    target: join(targetFolder, 'snippets', 'global.code-snippets'),
  }),
  ({ targetFolder }) => ({
    source: join('editor', 'vscode', 'default', 'comment.code-snippets'),
    target: join(targetFolder, 'snippets', 'comment.code-snippets'),
  }),
  () => ({
    source: join('editor', 'cursor', 'mcp.json'),
    target: join(MCP_TARGET_FOLDER, 'mcp.json'),
  }),
]

export function cursor(): Action {
  return {
    id: 'cursor',
    name: APP_NAME,
    targetFolder: createTargetFolderHandler(TARGET_FOLDERS),
    prehandler: ({ targetFolder, systemOptions }) => {
      if (!(systemOptions.platform in TARGET_FOLDERS)) {
        throw new HandlerError(`Unsupported platform: ${systemOptions.platform}`)
      }
      if (!isPathExist(targetFolder)) {
        throw new HandlerError(`You should install ${APP_NAME} first!`)
      }
      const snippetsFolder = join(targetFolder, 'snippets')
      if (!ensureDirectoryExist(snippetsFolder)) {
        throw new HandlerError(`Failed to create snippets folder: ${snippetsFolder}`)
      }
      if (!ensureDirectoryExist(MCP_TARGET_FOLDER)) {
        throw new HandlerError(`Failed to create MCP folder: ${MCP_TARGET_FOLDER}`)
      }
    },
    handler: createHandler(CONFIG_PATH_GENERATORS),
    posthandler: () => {
      consola.info(
        'This configuration is meant to be used by `Cursor` installed in user scope and default path.',
      )
      consola.info(
        'It uses with many opinionated preset: custom fonts, `Neovim` extension, `podman` integration, etc.',
      )
    },
  }
}
