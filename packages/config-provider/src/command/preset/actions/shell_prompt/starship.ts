import type { ActionFactory } from '../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createHandler, createPrehandler } from '../utils'

export const starship: ActionFactory = () => {
  return {
    id: 'starship',
    name: 'Starship',
    base: join('shell_prompt', 'starship'),
    destination: homedir('.config'),
    prehandler: createPrehandler('env-exist', { executable: 'starship' }),
    handler: createHandler([
      createConfigPathGenerator('starship.toml'),
    ]),
    posthandler: () => {
      consola.info('Nerd Fonts is required to display all icons correctly in Starship prompt.')
    },
  }
}
