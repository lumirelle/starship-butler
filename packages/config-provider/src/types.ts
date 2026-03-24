import type { PresetOptions } from './command/preset/types'
import type { SetOptions } from './command/set/types'

export interface ConfigProviderOptions {
  preset?: PresetOptions & {
    /** Rime input method special config. */
    rime?: {
      /** Whether Ctrl+Space has been disabled. */
      ctrlSpaceDisabled?: boolean
    }
  }
  set?: SetOptions
  version?: string
}
