import type { PresetOptions } from './types'
import { consola } from 'consola'
import { version } from '../../../package.json'
import { ASSETS_FOLDER } from '../../constants'
import { upsertUserRc } from '../utils'
import { filterActions } from './actions'
import { execute } from './command/execute'
import { list } from './command/list'
import { validateOptions } from './validate'

/**
 * Preset application configurations.
 *
 * @param options Configuration and command line interface options.
 */
export async function commandPreset(options: PresetOptions): Promise<void> {
  consola.debug('[config-provider] Assets folder path:', ASSETS_FOLDER)
  consola.debug('[config-provider] Received preset options:', options)

  if (!validateOptions(options)) {
    consola.debug('[config-provider] Invalid options detected, aborting configuration.')
    return
  }

  // Update the version of preset
  upsertUserRc({ version })

  const actions = await filterActions(options)
  consola.debug(`[config-provider] Found ${actions.length} preset${actions.length > 1 ? 's' : ''}.`)

  if (options.list) {
    list(actions)
  }
  else {
    await execute(actions, options)
  }
}
