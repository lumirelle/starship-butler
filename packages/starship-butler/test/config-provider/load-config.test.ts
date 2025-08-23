import { describe, expect, it } from 'vitest'
import { loadConfig } from '../../src/config'
import { stringify } from '../utils'
import rawJSONConfig from './.butlerrc.json'
import rawTSConfig from './butler.config'

describe('load config', () => {
  it('load JSON config correctly', async () => {
    const config = await loadConfig({
      configFile: './.butlerrc.json',
      cwd: import.meta.dirname,
    })
    delete config['config-provider'].version
    expect(stringify(config)).toEqual(stringify(rawJSONConfig))
  })

  it('load TS config correctly', async () => {
    const config = await loadConfig({
      configFile: './butler.config.ts',
      cwd: import.meta.dirname,
    })
    delete config['config-provider'].version
    expect(stringify(config)).toEqual(stringify(rawTSConfig))
  })
})
