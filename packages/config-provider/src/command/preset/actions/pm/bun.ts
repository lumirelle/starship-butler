import type { Action, ConfigPathGenerator } from '../../types'
import { join } from 'pathe'
import { HandlerError } from '../../error'
import { homedir, isPathExistEnv, processConfig } from '../utils'

const name = 'Bun'

const targetFolder = homedir()

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('pm', 'bun', 'bunfig.toml'),
    target: join(targetFolder, '.bunfig.toml'),
  }),
]
export function bun(): Action {
  return {
    id: 'bun',
    name,
    targetFolder,
    prehandler: async () => {
      if (!(await isPathExistEnv('bun')))
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
