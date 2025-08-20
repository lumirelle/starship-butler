import { describe, expect, it } from 'vitest'
import { loadConfig } from '../../src/utils'
import { stringify } from '../utils'
import rawJSONConfig from './.butlerrc.json'
import rawTSConfig from './butler.config'

describe('load config', () => {
  it('load JSON config correctly', async () => {
    const config = await loadConfig({
      configFile: './.butlerrc.json',
      cwd: import.meta.dirname,
    })
    expect(stringify(config)).toEqual(stringify(rawJSONConfig))
  })

  it('load TS config correctly', async () => {
    const config = await loadConfig({
      configFile: './butler.config.ts',
      cwd: import.meta.dirname,
    })
    expect(stringify(config)).toEqual(stringify(rawTSConfig))
  })
})
