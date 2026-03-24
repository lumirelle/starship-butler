import type { ActionFactory } from '../types'
import { consola } from 'consola'
import { join } from 'pathe'
import { homedir } from 'starship-butler-utils/path'
import { createConfigPathGenerator, createHandler } from '../utils'

export const bash: ActionFactory = () => {
  return {
    id: 'bash',
    name: 'Bash',
    base: join('shell', 'bash'),
    destination: homedir(),
    handler: createHandler([
      createConfigPathGenerator('.bash_profile'),
    ]),
    posthandler: ({ destination }) => {
      consola.info(
        `This configuration will use \`Starship\` as the prompt, if you don't want to use it, please edit this config \`(${join(destination, '.bash_profile')})\` manually, or consider not to include this action.`,
      )
    },
  }
}
