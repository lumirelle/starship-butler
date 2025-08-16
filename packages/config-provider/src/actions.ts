import type { ConfigureOptions } from './types'
import consola from 'consola'

interface Action {
  /**
   * Action name
   */
  name: string
  /**
   * Prehandler for the action, if returns `false` or throw an error, the handler will not be executed.
   * @param options The options from user config and user command line input
   * @returns Whether the action handler should be executed
   */
  prehandler?: (options: Partial<ConfigureOptions>) => boolean
  /**
   * Handler for the action
   * @param options The options from user config and user command line input
   */
  handler: (options: Partial<ConfigureOptions>) => void
  /**
   * Run after handler is executed, useful for cleanup or other post-processing logic.
   * @param options The options from user config and user command line input
   */
  posthandler?: (options: Partial<ConfigureOptions>) => void
}

/**
 * Predefined actions to configure your system.
 */
export const actions: Action[] = [
  {
    name: 'Action 1',
    prehandler: () => false,
    handler: async (options) => {
      consola.log('Action 1 executed', options)
    },
  },
]
