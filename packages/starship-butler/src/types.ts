import type { ConfigProviderOptionsFromConfig } from 'starship-butler-config-provider'

export interface ButlerConfig {
  'config-provider': Omit<Partial<ConfigProviderOptionsFromConfig>, 'lastRun'>
}
