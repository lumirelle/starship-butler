import { filterActions, PRESET_ACTIONS } from 'starship-butler-config-provider'
import { describe, expect, it } from 'vitest'
import { loadConfig, mergeOptions } from '../../../../../src/config'
import { stringify } from '../../../../utils'

describe('filter actions', () => {
  // Static config (likes JSON/YAML) does not support actions, only dynamic config (likes JS/TS) supports actions
  it('filter actions correctly for TS config', async () => {
    const config = await loadConfig({
      configFile: '../../../butler.config.ts',
      cwd: import.meta.dirname,
    })
    const configOptions = config['config-provider']
    const filteredActions = filterActions(PRESET_ACTIONS, mergeOptions(configOptions, {}))
    const simpleFilteredActions = filteredActions.map((item) => {
      return {
        id: item.id,
        name: item.name,
      }
    })
    expect(stringify(simpleFilteredActions)).toEqual(`[
  {
    "id": "nushell",
    "name": "setting up Nushell"
  }
]`)
  })
})
