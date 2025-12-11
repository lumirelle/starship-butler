import type { PresetOptions } from './command/preset/types'
import type { SetOptions } from './command/set/types'

export type ConfigProviderOptions = PresetOptions
  & SetOptions
  & {
    version: string
  }
