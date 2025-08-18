import type { Action } from 'starship-butler-config-provider'

export interface ButlerConfig {
  'config-provider': {
    /**
     * User define actions, will cover default actions.
     */
    actions?: Action[]
    /**
     * Actions should be ran.
     */
    include?: string[] | string
    /**
     * Actions should not be ran.
     */
    exclude?: string[] | string
    /**
     * Run actions forcedly
     */
    force?: boolean
    /**
     * Show verbose output.
     */
    verbose?: boolean
    /**
     * Dry run.
     */
    dryRun?: boolean
  }
}
