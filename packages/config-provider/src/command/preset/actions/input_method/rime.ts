import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { appdata, homedir } from 'starship-butler-utils/path'
import { createHandler, createTargetFolderHandler, isPathExist } from '../../actions/utils'

const APP_NAME = 'rime'

const TARGET_FOLDERS: PlatformTargetFolderMap = {
  win32: appdata('Rime'),
  linux: homedir('.config', 'ibus', 'rime'),
  darwin: homedir('Library', 'Rime'),
}

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('input_method', 'rime', 'default.custom.yaml'),
    target: join(targetFolder, 'default.custom.yaml'),
  }),
  ({ targetFolder }) => ({
    source: join('input_method', 'rime', 'wanxiang.custom.yaml'),
    target: join(targetFolder, 'wanxiang.custom.yaml'),
  }),
  ({ targetFolder }) => ({
    source: join('input_method', 'rime', 'weasel.custom.yaml'),
    target: join(targetFolder, 'weasel.custom.yaml'),
  }),
  ({ targetFolder, systemOptions }) =>
    systemOptions.platform === 'win32'
      ? {
          source: join('input_method', 'rime', 'disable-ctrl_space.reg'),
          target: join(targetFolder, 'disable-ctrl_space.reg'),
        }
      : null,
]

export function rime(): Action {
  return {
    id: 'rime',
    name: APP_NAME,
    prehandler: ({ targetFolder, systemOptions }) => {
      if (!(systemOptions.platform in TARGET_FOLDERS)) {
        throw new Error(`Unsupported platform: ${systemOptions.platform}`)
      }
      if (!isPathExist(targetFolder)) {
        throw new Error(`You should install ${APP_NAME} first!`)
      }
    },
    targetFolder: createTargetFolderHandler(TARGET_FOLDERS),
    handler: createHandler(CONFIG_PATH_GENERATORS),
    posthandler: ({ targetFolder, systemOptions }) => {
      consola.info(
        'Currently, this configuration only supports `Rime official input` method with default user configuration folder path. For Linux users, please make sure you are using `ibus-rime`. After applying the configuration, don\'t forget to deploy Rime and wait for few seconds/minutes! Just with patience :) ',
      )
      if (systemOptions.platform === 'win32') {
        consola.info(
          `If you are getting in trouble with disabling Ctrl+Space (which will switch input methods), please run the \`disable-ctrl_space.reg\` file in your Rime configuration folder (${targetFolder}) to fix it. Don't forget to restart your computer after applying the registry file!`,
        )
      }
    },
  }
}
