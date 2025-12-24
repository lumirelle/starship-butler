import type { Action, ConfigPathGenerator } from '../../types'
import { join } from 'pathe'
import { HandlerError } from '../../error'
import { homedir, isPathExistEnv, processConfig } from '../utils'

const name = '@sxzz/create'

const targetFolder = homedir('.config')

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('tools', 'sxzz-create', 'create.config.yml'),
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
    },
    handler: async ({ options, targetFolder }) => {
      for (const generator of configPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
  }
}
