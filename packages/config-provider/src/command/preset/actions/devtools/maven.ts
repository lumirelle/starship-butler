import type { ActionFactory } from '../types'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createHandler } from '../utils'

export const maven: ActionFactory = () => {
  return {
    id: 'maven',
    name: 'Maven',
    base: join('devtools', 'maven'),
    destination: homedir('.m2'),
    handler: createHandler([
      createConfigPathGenerator('settings.xml'),
    ]),
  }
}
