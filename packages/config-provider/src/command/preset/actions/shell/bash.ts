import type { Action, ConfigPathGenerator } from '../../types'
import { join } from 'pathe'
import { homedir, processConfig } from '../utils'

const name = 'Bash'

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('shell', 'bash', '.bash_profile'),
    target: join(targetFolder, '.bash_profile'),
  }),
]

export function bash(): Action {
  return {
    id: 'bash',
    name,
    targetFolder: homedir(),
    handler: async ({ options, targetFolder }) => {
      for (const generator of configPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
  }
}
