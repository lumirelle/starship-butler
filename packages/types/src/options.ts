/**
 * Basic (Configuration and Command-line) options for butler's command.
 */
export interface BasicOptions {
  /**
   * Show verbose output.
   *
   * @default false
   */
  verbose: boolean
  /**
   * Dry run.
   *
   * @default false
   */
  dryRun: boolean
}

/**
 * Options contains user's system information.
 */
export interface SystemOptions {
  /**
   * User's platform (e.g. 'win32', 'linux', 'darwin').
   */
  platform: NodeJS.Platform
}
