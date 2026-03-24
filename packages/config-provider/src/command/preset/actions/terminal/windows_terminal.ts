import type { ActionFactory } from '../types'
import process from 'node:process'
import { consola } from 'consola'
import { join } from 'pathe'
import { localAppdata } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createHandler, createPrehandler } from '../utils'

export const windowsTerminal: ActionFactory = () => {
  if (process.platform !== 'win32')
    return
  return {
    id: 'windows-terminal',
    name: 'Windows Terminal',
    base: join('terminal', 'windows_terminal'),
    destination: localAppdata('Packages', 'Microsoft.WindowsTerminal_8wekyb3d8bbwe', 'LocalState'),
    prehandler: createPrehandler('destination-exist'),
    handler: createHandler([
      createConfigPathGenerator('settings.json'),
    ]),
    posthandler: ({ destination }) => {
      consola.info(
        `This configuration will use \`'"Geist Mono", "Maple Mono CN", "Symbols Nerd Font Mono"'\` as terminal fonts, \`Nushell\` as default shell. If you don't want to use them, please edit this config \`(${join(destination, 'settings.json')})\` manually or consider not to include this action.`,
      )
    },
  }
}
