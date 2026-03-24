import type { RC, RCOptions } from 'starship-butler-utils/config'
import { readUserRc as _readUserRc, upsertUserRc as _upsertUserRc } from 'starship-butler-utils/config'

/**
 * Updates or creates a user rc file, within `config-provider` field (rc file under home directory).
 *
 * Default rc file name is ".butlerrc".
 *
 * @param config The config to upsert to the `config-provider` field of rc file.
 * @param options Options for rc9.
 */
export function upsertUserRc(config: RC, options?: RCOptions): void {
  return _upsertUserRc({
    'config-provider': config,
  }, options)
}

/**
 * Reads the `config-provider` field from the user rc file (rc file under home directory).
 *
 * Default rc file name is ".butlerrc".
 *
 * @param options Options for rc9.
 * @returns The `config-provider` field from the rc content.
 */
export function readUserRc(options?: RCOptions): RC {
  return _readUserRc(options)?.['config-provider'] ?? {}
}
