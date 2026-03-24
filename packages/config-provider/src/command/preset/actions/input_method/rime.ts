import type { ActionFactory } from '../types'
import process from 'node:process'
import { confirm } from '@clack/prompts'
import { consola } from 'consola'
import { join } from 'pathe'
import { appdata, homedir } from 'starship-butler-utils/path'
import { x } from 'tinyexec'
import { createConfigPathGenerator, createDestinationHandler, createHandler, createPrehandler } from '../utils'

export const rime: ActionFactory = () => {
  return {
    id: 'rime',
    name: 'rime',
    base: join('input_method', 'rime'),
    destination: createDestinationHandler({
      win32: appdata('Rime'),
      linux: homedir('.config', 'ibus', 'rime'),
      darwin: homedir('Library', 'Rime'),
    }),
    prehandler: createPrehandler('destination-exist'),
    handler: createHandler([
      createConfigPathGenerator('default.custom.yaml'),
      createConfigPathGenerator('wanxiang.custom.yaml'),
      createConfigPathGenerator('weasel.custom.yaml'),
      process.platform === 'win32' && createConfigPathGenerator('disable-ctrl_space.reg'),
    ]),
    posthandler: async ({ destination }) => {
      consola.info(
        'Currently, this configuration only supports `Rime official input` method with default user configuration folder path. For Linux users, please make sure you are using `ibus-rime`. After applying the configuration, don\'t forget to deploy Rime and wait for few seconds/minutes! Just with patience :) ',
      )
      if (process.platform === 'win32') {
        consola.info(
          `If you are getting in trouble with disabling Ctrl+Space (which will switch input methods), please run the \`disable-ctrl_space.reg\` file in your Rime configuration folder (${destination}) to fix it. Don't forget to restart your computer after applying the registry file!`,
        )
        if (await confirm({ message: 'Run Powershell script to disable Ctrl+Space?' })) {
          const regFilePath = join(destination, 'disable-ctrl_space.reg')
          const result = await x('reg', ['import', regFilePath])
          if (result.exitCode === 0)
            consola.success('Successfully applied the registry file to disable Ctrl+Space!')
          else
            consola.error('Failed to apply the registry file. Please try to run it with administrator privileges.')
        }
      }
    },
  }
}
