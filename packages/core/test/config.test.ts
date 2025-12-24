import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { readUserRc, removeUserRc, writeUserRc } from 'starship-butler-utils/config'
import { version } from '../package.json'
import { loadConfig } from '../src/config'

beforeAll(() => {
  // Backup user rc file before all test
  const rc = readUserRc()
  writeUserRc(rc, { name: '.butlerrc.bak' })
})

beforeEach(() => {
  // Initialize an example rc file for testing
  writeUserRc({ 'config-provider': { version } })
})

afterAll(() => {
  // Restore user rc file after all tests
  const rc = readUserRc({ name: '.butlerrc.bak' })
  writeUserRc(rc)
  removeUserRc({ name: '.butlerrc.bak' })
})

describe('config', () => {
  it('should load JSON config file with global rc correctly', async () => {
    const config = await loadConfig({
      configFile: './fixture/butler.config.json',
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
      configFile: './fixture/butler.config.ts',
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
      configFile: './fixture/butler.config-with-version.json',
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
      configFile: './fixture/butler.config-with-version.ts',
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
