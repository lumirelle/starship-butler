import type { ConfigProviderOptionsFromConfig } from 'starship-butler-config-provider'

export interface ButlerConfig<ConfigProviderT extends Partial<ConfigProviderOptionsFromConfig> = Partial<ConfigProviderOptionsFromConfig>> {
  'config-provider': ConfigProviderT
}
