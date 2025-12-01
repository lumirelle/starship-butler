import type { ButlerConfig } from '../src/config'
import { describe, expect, it } from 'vitest'
import { loadConfig, mergeOptions } from '../src/config'
import rawJSONConfig from './.butlerrc.json'
import rawTSConfig from './butler.config'

describe('options', () => {
  it('merge with JSON config correctly', async () => {
    const config = await loadConfig({
      configFile: './.butlerrc.json',
      cwd: import.meta.dirname,
    })
    const configOptions = config['config-provider']
    const mergedOptions = mergeOptions(configOptions, {
      includeOnly: ['git'],
      mode: 'symlink',
      force: true,
      dryRun: true,
    })
    delete mergedOptions.version
    const expectedOptions = rawJSONConfig['config-provider'] as ButlerConfig['config-provider']
    expectedOptions.includeOnly = ['git']
    expectedOptions.mode = 'symlink'
    expectedOptions.force = true
    expectedOptions.dryRun = true
    expect(mergedOptions).toEqual(expectedOptions)
  })

  it('merge with TS config correctly', async () => {
    const config = await loadConfig({
      configFile: './butler.config.ts',
      cwd: import.meta.dirname,
    })
    const configOptions = config['config-provider']
    const mergedOptions = mergeOptions(configOptions, {
      includeOnly: ['git'],
      mode: 'symlink',
      force: true,
      dryRun: true,
    })
    delete mergedOptions.version
    const expectedOptions = rawTSConfig['config-provider'] as ButlerConfig['config-provider']
    expectedOptions.includeOnly = ['git']
    expectedOptions.mode = 'symlink'
    expectedOptions.force = true
    expectedOptions.dryRun = true
    expect(mergedOptions).toEqual(expectedOptions)
  })
})
