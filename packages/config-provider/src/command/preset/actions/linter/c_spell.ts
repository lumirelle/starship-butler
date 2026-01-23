import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createHandler } from '../utils'

const name = 'cSpell'

const targetFolder = homedir()

const configPathGenerators: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('linter', 'cspell', '.cspell.common.txt'),
    target: join(targetFolder, '.cspell.common.txt'),
  }),
]

export function cSpell(): Action {
  return {
    id: 'cspell',
    name,
    targetFolder,
    handler: createHandler(configPathGenerators),
    posthandler: () => {
      consola.info('I prefer using cSpell as an extension for VSCode/Cursor/Zed, this configuration is meant to be used by them.')
    },
  }
}
