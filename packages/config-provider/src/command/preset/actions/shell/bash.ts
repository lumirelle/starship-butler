import type { Action, ConfigPathGenerator } from '../../types'
import { homedir, join } from 'starship-butler-utils/path'
import { createHandler } from '../utils'

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
