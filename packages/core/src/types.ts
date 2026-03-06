import type { ConfigProviderOptions } from 'starship-butler-config-provider'

// #region Config

/**
 * Type definition for Butler configuration.
 */
export interface ButlerConfig {
  /**
   * Configuration for `config-provider` package.
   */
  'config-provider': Partial<ConfigProviderOptions>
}

/**
 * Type definition for Butler configuration, excludes auto-generated fields.
 */
export type SafeButlerConfig = Omit<
  Partial<ButlerConfig>,
  'config-provider'
>
& {
  'config-provider'?: Omit<Partial<ConfigProviderOptions>, 'version'>
}

// #endregion
