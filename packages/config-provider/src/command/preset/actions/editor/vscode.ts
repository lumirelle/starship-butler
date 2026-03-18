import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { appdata, homedir } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import {
  createHandler,
  createTargetFolderHandler,
  ensureDirectoryExist,
  isPathExist,
} from '../utils'

const APP_NAME = 'VSCode'

const TARGET_FOLDERS: PlatformTargetFolderMap = {
  win32: appdata('Code', 'User'),
  linux: homedir('.config', 'Code', 'User'),
  darwin: homedir('Library', 'Application Support', 'Code', 'User'),
}

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
]

export function vscode(): Action {
  return {
    id: 'vscode',
    name: APP_NAME,
    targetFolder: createTargetFolderHandler(TARGET_FOLDERS),
    prehandler: ({ targetFolder, systemOptions }) => {
      if (!(systemOptions.platform in TARGET_FOLDERS)) {
        throw new HandlerError(`Unsupported platform: ${systemOptions.platform}`)
      }
      if (!isPathExist(targetFolder)) {
        throw new HandlerError(`You should install ${APP_NAME} first!`)
      }
      if (!ensureDirectoryExist(join(targetFolder, 'snippets'))) {
        throw new HandlerError(`Failed to create snippets directory for ${APP_NAME}!`)
      }
    },
    handler: createHandler(CONFIG_PATH_GENERATORS),
    posthandler: () => {
      consola.info(
        'This configuration is meant to be used by `Visual Studio Code` installed in user scope and default path.',
      )
      consola.info(
        'It uses with many opinionated preset: custom fonts, `Neovim` extension, `podman` integration, etc.',
      )
    },
  }
}
