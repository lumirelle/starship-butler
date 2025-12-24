import type { Action, ConfigPathGenerator } from '../../types'
import { join } from 'pathe'
import { createHandler, homedir } from '../utils'

const name = 'Bash'

const targetFolder = homedir()

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
    targetFolder,
    handler: createHandler(configPathGenerators),
  }
}
