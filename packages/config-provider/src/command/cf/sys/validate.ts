import type { ConfigureSystemOptions } from './types'
import { unindent } from '@antfu/utils'
import consola from 'consola'

export function validateOptions(options: Partial<ConfigureSystemOptions>): boolean {
  if (options.includeOnly && options.exclude) {
    consola.warn(
      unindent`
        Use \`includeOnly\` with \`exclude\`:
        It's not recommended to specify both \`includeOnly\` and \`exclude\` options.
        \`includeOnly\` has higher priority than \`exclude\`, may cause unexpected behavior.
      `,
    )
  }

  if (options.mode && !['copy-paste', 'symlink'].includes(options.mode)) {
    consola.error(`Invalid mode "${options.mode}" detected, only "copy-paste" and "symlink" are allowed.`)
    return false
  }

  return true
}
