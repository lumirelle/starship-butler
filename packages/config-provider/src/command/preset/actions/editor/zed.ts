import type { ActionFactory } from '../types'
import { join } from 'pathe'
import { appdata, homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createDestinationHandler, createHandler, createPrehandler } from '../utils'

export const zed: ActionFactory = () => {
  return {
    id: 'zed',
    name: 'Zed',
    base: join('editor', 'zed'),
    destination: createDestinationHandler({
      win32: appdata('Zed'),
      linux: homedir('.config', 'Zed'),
      darwin: homedir('Library', 'Application Support', 'Zed'),
    }),
    prehandler: createPrehandler('destination-exist'),
    handler: createHandler([
      createConfigPathGenerator('settings.json'),
      createConfigPathGenerator('keymap.json'),
    ]),
  }
}
