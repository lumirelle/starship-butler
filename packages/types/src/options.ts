/**
 * Basic options for config & cli.
 */
export interface OptionsBasic {
  /**
   * Show verbose output.
   * @default false
   */
  verbose: boolean
  /**
   * Dry run.
   * @default false
   */
  dryRun: boolean
}

export interface SystemOptions {
  /**
   * User platform (e.g. 'win32', 'linux', 'darwin').
   */
  userPlatform: NodeJS.Platform
}
