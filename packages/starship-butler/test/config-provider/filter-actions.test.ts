import { filterActions } from 'starship-butler-config-provider'
import { describe, expect, it } from 'vitest'
import { loadConfig, mergeOptions } from '../../src/config'
import { stringify } from '../utils'

describe('filter actions', () => {
  // Static config (likes JSON/YAML) does not support actions, only dynamic config (likes JS/TS) supports actions
  it('filter actions correctly for TS config', async () => {
    const config = await loadConfig({
      configFile: './butler.config.ts',
      cwd: import.meta.dirname,
    })
    const filteredActions = filterActions(mergeOptions(config, 'config-provider', { include: ['Action In Config 2'] }))
    expect(stringify(filteredActions)).toEqual(`[
  {
    "name": "Action In Config 2",
    "handler": "() => { console.log('Running action in config 2.'); }"
  }
]`)
  })
})
