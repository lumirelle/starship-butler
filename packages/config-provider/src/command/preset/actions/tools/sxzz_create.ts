import type { ActionFactory } from '../types'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createHandler, createPrehandler } from '../utils'

export const sxzzCreate: ActionFactory = () => {
  return {
    id: '@sxzz/create',
    name: '@sxzz/create',
    base: join('tools', 'sxzz_create'),
    destination: homedir('.config'),
    prehandler: createPrehandler('env-exist', { executable: 'create' }),
    handler: createHandler([
      createConfigPathGenerator('create.config.yml'),
    ]),
  }
}
