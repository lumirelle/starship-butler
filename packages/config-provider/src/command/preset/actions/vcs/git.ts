import type { Action, ConfigPathGenerator } from '../../types'
import { homedir, join } from 'starship-butler-utils/path'
import { createHandler } from '../utils'

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
    handler: createHandler(configPathGenerators),
  }
}
