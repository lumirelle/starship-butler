import type { ActionFactory } from '../types'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createHandler, createPrehandler } from '../utils'

export const maven: ActionFactory = () => {
  return {
    id: 'maven',
    name: 'Maven',
    base: join('pm', 'maven'),
    destination: homedir('.m2'),
    prehandler: createPrehandler('env-exist', { executable: 'mvn' }),
    handler: createHandler([
      createConfigPathGenerator('settings.xml'),
    ]),
  }
}
