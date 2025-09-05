import type { SetOptionsFromConfig } from './set'
import type { SetSysOptionsFromConfig } from './set-sys'

export type ConfigProviderOptionsFromConfig = SetSysOptionsFromConfig & SetOptionsFromConfig
