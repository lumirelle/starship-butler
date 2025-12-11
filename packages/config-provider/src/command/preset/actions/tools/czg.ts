import type { Action, ConfigPathGenerator } from '../../types'
import { join } from 'pathe'
import { homedir, isPathExistEnv, processConfig } from '../utils'

const name = 'czg'

const targetFolder = homedir()

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('tools', 'czg', '.czrc'),
    target: join(targetFolder, '.czrc'),
  }),
]
export function czg(): Action {
  return {
    id: 'czg',
    name,
    targetFolder,
    prehandler: async () => {
      if (!(await isPathExistEnv('czg', `You should install ${name} first!`))) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      for (const generator of configPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
  }
}
