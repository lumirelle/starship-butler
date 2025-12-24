import { describe, expect, it } from 'bun:test'
import { version } from '../package.json'
import { loadConfig } from '../src/config'

describe('config', () => {
  it('should load JSON config file with global rc correctly', async () => {
    const config = await loadConfig({
      configFile: './.butlerrc.json',
      cwd: import.meta.dirname,
    })
    expect(config).toMatchInlineSnapshot(`
      {
        "config-provider": {
          "includeOnly": [
            "nushell",
          ],
          "version": "${version}",
        },
      }
    `)
  })

  it('should load from TS config file with global rc correctly', async () => {
    const config = await loadConfig({
      configFile: './butler.config.ts',
      cwd: import.meta.dirname,
    })
    expect(config).toMatchInlineSnapshot(`
      {
        "config-provider": {
          "include": [
            "nushell",
          ],
          "version": "${version}",
        },
      }
    `)
  })

  it('should load from JSON config file with global rc and ignore version from JSON config file', async () => {
    const config = await loadConfig({
      configFile: './.butlerrc-with-version.json',
      cwd: import.meta.dirname,
    })
    expect(config).toMatchInlineSnapshot(`
      {
        "config-provider": {
          "includeOnly": [
            "nushell",
          ],
          "version": "${version}",
        },
      }
    `)
  })

  it('should load from TS config file with global rc and ignore version from TS config file', async () => {
    const config = await loadConfig({
      configFile: './butler.config-with-version.ts',
      cwd: import.meta.dirname,
    })
    expect(config).toMatchInlineSnapshot(`
      {
        "config-provider": {
          "include": [
            "nushell",
          ],
          "version": "${version}",
        },
      }
    `)
  })
})
