import type { Action, ConfigPathGenerator } from '../../types'
import { homedir, join } from 'starship-butler-utils/path'
import { HandlerError } from '../../error'
import { createHandler, ensureDirectoryExist, isPathExistEnv } from '../utils'

const name = '@sxzz/create'

const targetFolder = homedir('.config')

const configPathGenerators: ConfigPathGenerator[] = [
  ({ targetFolder }) => ({
    source: join('tools', 'sxzz_create', 'create.config.yml'),
    target: join(targetFolder, 'create.config.yml'),
  }),
]
export function sxzzCreate(): Action {
  return {
    id: '@sxzz/create',
    name,
    targetFolder,
    prehandler: async () => {
      if (!(await isPathExistEnv('create')))
        throw new HandlerError(`You should install ${name} first!`)
      if (!(ensureDirectoryExist(targetFolder)))
        throw new HandlerError(`Failed to create @sxzz/create configuration folder: ${targetFolder}`)
    },
    handler: createHandler(configPathGenerators),
  }
}
