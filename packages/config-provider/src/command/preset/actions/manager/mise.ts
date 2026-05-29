import type { ActionFactory } from '../types'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createHandler, createPrehandler } from '../utils'

export const mise: ActionFactory = () => {
  return {
    id: 'mise',
    name: 'Mise',
    base: join('manager', 'mise'),
    destination: homedir('.config', 'mise'),
    prehandler: createPrehandler('env-exist', { executable: 'mise' }),
    handler: createHandler([
      createConfigPathGenerator('config.toml'),
    ]),
  }
}
