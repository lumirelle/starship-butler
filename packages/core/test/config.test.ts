import { stringify } from 'starship-butler-utils'
import { describe, expect, it } from 'vitest'
import { loadConfig } from '../src/config'
import rawJSONConfig from './.butlerrc.json'
import rawTSConfig from './butler.config'

describe('config', () => {
  it('load from JSON file correctly', async () => {
    const config = await loadConfig({
      configFile: './.butlerrc.json',
      cwd: import.meta.dirname,
    })
    delete config['config-provider'].version
    expect(stringify(config)).toEqual(stringify(rawJSONConfig))
  })

  it('load from TS file correctly', async () => {
    const config = await loadConfig({
      configFile: './butler.config.ts',
      cwd: import.meta.dirname,
    })
    delete config['config-provider'].version
    expect(stringify(config)).toEqual(stringify(rawTSConfig))
  })
})
