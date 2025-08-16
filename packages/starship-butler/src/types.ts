import type { Action } from 'starship-butler-config-provider'

export interface ButlerConfig {
  'config-provider': {
    include: string[] | string
    exclude: string[] | string
    force: boolean
    verbose: boolean
    dryRun: boolean
    actions: Action[]
  }
}
