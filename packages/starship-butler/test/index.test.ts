import { filterActions } from 'starship-butler-config-provider'
import { describe, expect, it } from 'vitest'
import { loadConfig, mergeOptions } from '../src/utils'
import rawConfig from './butler.config'
import { stringify } from './utils'

describe('load config', () => {
  it('load config correctly', async () => {
    const config = await loadConfig({
      configFile: './butler.config.ts',
      cwd: import.meta.dirname,
    })
    expect(stringify(config)).toEqual(stringify(rawConfig))
  })

  it('merge options correctly', async () => {
    const config = await loadConfig({
      configFile: './butler.config.ts',
      cwd: import.meta.dirname,
    })
    const mergedOptions = mergeOptions(config, 'config-provider', {})
    const expectedOptions = rawConfig['config-provider']
    expect(stringify(mergedOptions)).toEqual(stringify(expectedOptions))
  })

  it('filter actions correctly', async () => {
    const config = await loadConfig({
      configFile: './butler.config.ts',
      cwd: import.meta.dirname,
    })
    const filteredActions = filterActions(mergeOptions(config, 'config-provider', {}))
    expect(stringify(filteredActions)).toEqual(`[
  {
    "name": "Action In Config 1",
    "handler": "() => { console.log('Running action in config 1.'); }"
  }
]`)
  })
})
