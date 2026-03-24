import type { ActionFactory } from '../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createHandler } from '../utils'

export const cSpell: ActionFactory = () => {
  return {
    id: 'cspell',
    name: 'cSpell',
    base: join('linter', 'cspell'),
    destination: homedir(),
    handler: createHandler([
      createConfigPathGenerator('.cspell.common.txt'),
    ]),
    posthandler: () => {
      consola.info(
        'I prefer using cSpell as an extension for VSCode/Cursor/Zed, this configuration is meant to be used by them.',
      )
    },
  }
}
