/**
 * Command line options for configuring the system.
 */
export interface ConfigureOptions {
  include: string[] | string
  exclude: string[] | string
  force: boolean
  verbose: boolean
  dryRun: boolean
}

/**
 * Action interface for defining actions to run.
 */
export interface Action {
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
