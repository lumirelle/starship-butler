import { describe, expect, it } from 'vitest'
import { loadConfig } from '../src/utils'
import rawConfig from './butler.config'

describe('should', () => {
  it('load config correctly', async () => {
    const config = await loadConfig({
      configFile: './butler.config.ts',
      cwd: import.meta.dirname,
    })
    expect(JSON.stringify(config)).eq(JSON.stringify(rawConfig))
  })
})
