import type { Action, ConfigPathGenerator } from '../../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createHandler } from '../utils'

const APP_NAME = 'cSpell'

const TARGET_FOLDER = homedir()

const CONFIG_PATH_GENERATORS: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('linter', 'cspell', '.cspell.common.txt'),
    target: join(targetFolder, '.cspell.common.txt'),
  }),
]

export function cSpell(): Action {
  return {
    id: 'cspell',
    name: APP_NAME,
    targetFolder: TARGET_FOLDER,
    handler: createHandler(CONFIG_PATH_GENERATORS),
    posthandler: () => {
      consola.info(
        'I prefer using cSpell as an extension for VSCode/Cursor/Zed, this configuration is meant to be used by them.',
      )
    },
  }
}
