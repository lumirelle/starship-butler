import type { ActionFactory } from '../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { appdata, homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createDestinationHandler, createHandler, createPrehandler } from '../utils'

const APP_ID = 'nushell'

export const nushell: ActionFactory = () => {
  return {
    id: 'nushell',
    name: 'Nushell',
    base: join('shell', 'nu'),
    destination: createDestinationHandler({
      win32: appdata(APP_ID),
      linux: homedir('.config', APP_ID),
      darwin: homedir('Library', 'Application Support', APP_ID),
    }),
    prehandler: createPrehandler('destination-exist'),
    handler: createHandler([
      createConfigPathGenerator('utils.nu'),
      createConfigPathGenerator('config.nu'),
      createConfigPathGenerator('env.nu'),
    ]),
    posthandler: ({ destination }) => {
      consola.info(
        `This configuration will use \`Starship\` as the prompt, if you don't want to use it, please edit this config \`(${join(destination, 'config.nu')})\` manually, or consider not to include this action.`,
      )
    },
  }
}
