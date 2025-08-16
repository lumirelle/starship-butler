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
