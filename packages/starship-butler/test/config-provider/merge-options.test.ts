import type { ButlerConfig } from '../../src/types'
import { describe, expect, it } from 'vitest'
import { loadConfig, mergeOptions } from '../../src/config'
import { stringify } from '../utils'
import rawJSONConfig from './.butlerrc.json'
import rawTSConfig from './butler.config'

describe('merge options', () => {
  it('merge options correctly for JSON config', async () => {
    const config = await loadConfig({
      configFile: './.butlerrc.json',
      cwd: import.meta.dirname,
    })
    const configOptions = config['config-provider']
    const mergedOptions = mergeOptions(configOptions, { actions: [{ name: 'test', handler: () => { } }] })
    delete mergedOptions.version
    const expectedOptions = rawJSONConfig['config-provider'] as ButlerConfig['config-provider']
    expectedOptions.actions = [{ name: 'test', handler: () => { } }]
    expect(stringify(mergedOptions)).toEqual(stringify(expectedOptions))
  })

  it('merge options correctly for TS config', async () => {
    const config = await loadConfig({
      configFile: './butler.config.ts',
      cwd: import.meta.dirname,
    })
    const configOptions = config['config-provider']
    const mergedOptions = mergeOptions(configOptions, { actions: [{ name: 'test', handler: () => { } }] })
    delete mergedOptions.version
    const expectedOptions = rawTSConfig['config-provider'] as ButlerConfig['config-provider']
    expectedOptions.actions = [{ name: 'test', handler: () => { } }]
    expect(stringify(mergedOptions)).toEqual(stringify(expectedOptions))
  })
})
