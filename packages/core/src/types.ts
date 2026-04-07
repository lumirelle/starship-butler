import type { ConfigProviderOptions } from 'starship-butler-config-provider'

// #region Types from `starship-butler-types`

export type * from 'starship-butler-types'

// #endregion

// #region Config

/**
 * Type definition for Butler configuration.
 */
export interface ButlerConfig {
  /**
   * Configuration for `config-provider` package.
   */
  'config-provider'?: ConfigProviderOptions
}

/**
 * Type definition for Butler configuration, excludes auto-generated fields.
 */
export type SafeButlerConfig = Omit<ButlerConfig, 'config-provider'>
  & {
    'config-provider'?: Omit<ConfigProviderOptions, 'version'>
  }

// #endregion
