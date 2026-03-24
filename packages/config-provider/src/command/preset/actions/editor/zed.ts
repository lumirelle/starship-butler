import type { ActionFactory } from '../types'
import { consola } from 'consola'
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
    ]),
    posthandler: () => {
      consola.info('This configuration is meant to be used by `Zed` installed in user scope and default path.')
    },
  }
}
