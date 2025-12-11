import type { Action, ConfigPathGenerator } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { homedir, processConfig } from '../utils'

const name = 'cSpell'

const targetFolder = homedir()

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('linter', 'cspell', '.cspell.common.txt'),
    target: join(targetFolder, '.cspell.common.txt'),
  }),
]
export function cSpell(): Action {
  return {
    id: 'cspell',
    name,
    targetFolder,
    handler: async ({ options, targetFolder }) => {
      for (const generator of configPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
    posthandler: () => {
      consola.info('I prefer using cSpell as an extension for VSCode/Cursor/Zed, this configuration is meant to be used by them.')
    },
  }
}
