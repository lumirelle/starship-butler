import type { ActionFactory } from '../types'
import { join } from 'pathe'
import { appdata, homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createDestinationHandler, createHandler, createPrehandler } from '../utils'

const APP_ID = 'io.github.clash-verge-rev.clash-verge-rev'

export const clashVergeRev: ActionFactory = () => {
  return {
    id: 'clash-verge-rev',
    name: 'Clash Verge Rev',
    base: join('network', 'clash_verge_rev'),
    destination: createDestinationHandler({
      win32: appdata(APP_ID, 'profiles'),
      linux: homedir('.local', 'shared', APP_ID, 'profiles'),
      darwin: homedir('Library', 'Application Support', APP_ID, 'profiles'),
    }),
    prehandler: createPrehandler('destination-exist'),
    handler: createHandler([
      createConfigPathGenerator('Script.js'),
    ]),
  }
}
