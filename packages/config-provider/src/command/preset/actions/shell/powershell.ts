import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import {
  createHandler,
  createTargetFolderHandler,
  ensureDirectoryExist,
  isPathExistEnv,
} from '../utils'

const APP_NAME = 'PowerShell'

const TARGET_FOLDERS: PlatformTargetFolderMap = {
  win32: homedir('Documents', 'PowerShell'),
  linux: homedir('.config', 'powershell'),
  darwin: homedir('.config', 'powershell'),
}

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('shell', 'pwsh', 'profile.ps1'),
    target: join(targetFolder, 'profile.ps1'),
  }),
  ({ targetFolder }) => ({
    source: join('shell', 'pwsh', 'powershell.config.json'),
    target: join(targetFolder, 'powershell.config.json'),
  }),
]

export function powershell(): Action {
  return {
    id: 'powershell',
    name: APP_NAME,
    targetFolder: createTargetFolderHandler(TARGET_FOLDERS),
    prehandler: async ({ targetFolder }) => {
      if (!(await isPathExistEnv('pwsh'))) {
        throw new HandlerError(
          `You should install ${APP_NAME} first and add it to your system's PATH environment variable!`,
        )
      }
      if (!ensureDirectoryExist(targetFolder)) {
        throw new HandlerError(`Failed to create PowerShell profile folder: ${targetFolder}`)
      }
    },
    handler: createHandler(CONFIG_PATH_GENERATORS),
    posthandler: ({ targetFolder }) => {
      consola.info(
        `This configuration will use \`Starship\` as the prompt, if you don't want to use it, please edit this config \`(${join(targetFolder, 'profile.ps1')})\` manually.`,
      )
    },
  }
}
