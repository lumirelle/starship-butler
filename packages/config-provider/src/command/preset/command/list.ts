import type { Action } from '../actions/types'
import { styleText } from 'node:util'
import consola from 'consola'

export function list(actions: Action[]): void {
  if (actions.length === 0) {
    consola.info('No preset found for your system platform.')
  }
  else {
    consola.info('Available presets:')
    actions.forEach((action, index) => {
      consola.info(`${index + 1}. ${styleText('green', `<${action.id}>`)} - ${action.name}`)
    })
  }
}
