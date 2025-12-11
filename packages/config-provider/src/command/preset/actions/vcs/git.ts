import type { Action, ConfigPathGenerator } from '../../types'
import { join } from 'pathe'
import { homedir, processConfig } from '../utils'

const name = 'Git'

const targetFolder = homedir()

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('vcs', 'git', '.gitconfig'),
    target: join(targetFolder, '.gitconfig'),
  }),
]

export function git(): Action {
  return {
    id: 'git',
    name,
    targetFolder,
    handler: async ({ options, targetFolder }) => {
      for (const generator of configPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
  }
}
