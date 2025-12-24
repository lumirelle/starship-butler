import type { Action, ConfigPathGenerator } from '../../types'
import { join } from 'pathe'
import { HandlerError } from '../../error'
import { createHandler, ensureDirectoryExist, homedir, isPathExistEnv } from '../utils'

const name = 'Maven'

const targetFolder = homedir('.m2')

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('pm', 'maven', 'settings.xml'),
    target: join(targetFolder, 'settings.xml'),
  }),
]
export function maven(): Action {
  return {
    id: 'maven',
    name,
    targetFolder,
    prehandler: async ({ targetFolder }) => {
      if (!(await isPathExistEnv('mvn')))
        throw new HandlerError(`You should install ${name} first!`)
      if (!ensureDirectoryExist(targetFolder))
        throw new HandlerError(`Failed to create maven folder: ${targetFolder}`)
    },
    handler: createHandler(configPathGenerators),
  }
}
