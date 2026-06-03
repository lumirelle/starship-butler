import { readUserConfig, removeUserConfig, writeUserConfig } from 'starship-butler-utils/config'
import { ensureDirectory } from 'starship-butler-utils/fs'
import { homedir } from 'starship-butler-utils/path'
import { isCI } from 'std-env'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { loadConfig } from '../src/config'

beforeAll(() => {
  // Some CI environments (like GitHub Actions) may not have a config directory, which will cause the test to fail. So we need to ensure the config directory exist before testing.
  if (isCI)
    ensureDirectory(homedir('.config'))
  // Backup user rc file before all test
  const rc = readUserConfig()
  writeUserConfig(rc, { name: '.butlerrc.bak' })
})
beforeEach(() => {
  // Initialize an example rc file for testing
  writeUserConfig({ 'config-provider': { preset: { version: '0.0.0' } } })
})
afterAll(() => {
  // Restore user rc file after all tests
  const rc = readUserConfig({ name: '.butlerrc.bak' })
  writeUserConfig(rc)
  removeUserConfig({ name: '.butlerrc.bak' })
})

describe('config', () => {
  describe('defineButlerConfig()', () => {
    it('should return the config as it is', () => {
      const config = {
        'config-provider': {
          preset: {
            include: ['nushell'],
            version: '0.0.0',
          },
        },
      } as const
      expect(config).toEqual(config)
    })
  })

  describe('loadConfig()', () => {
    it('should load JSON config file with global rc correctly', async () => {
      const config = await loadConfig({
        configFile: './fixtures/butler.config.json',
        cwd: import.meta.dirname,
      })
      expect(config).toMatchInlineSnapshot(`
{
  "config-provider": {
    "preset": {
      "includeOnly": [
        "nushell",
      ],
      "version": "0.0.0",
    },
  },
}
`)
    })

    it('should load from TS config file with global rc correctly', async () => {
      const config = await loadConfig({
        configFile: './fixtures/butler.config.ts',
        cwd: import.meta.dirname,
      })
      expect(config).toMatchInlineSnapshot(`
{
  "config-provider": {
    "preset": {
      "include": [
        "nushell",
      ],
      "version": "0.0.0",
    },
  },
}
`)
    })

    it('should load from JSON config file with global rc and ignore version from JSON config file', async () => {
      const config = await loadConfig({
        configFile: './fixtures/butler.config-with-version.json',
        cwd: import.meta.dirname,
      })
      expect(config).toMatchInlineSnapshot(`
{
  "config-provider": {
    "preset": {
      "includeOnly": [
        "nushell",
      ],
      "version": "0.0.0",
    },
  },
}
`)
    })

    it('should load from TS config file with global rc and ignore version from TS config file', async () => {
      const config = await loadConfig({
        configFile: './fixtures/butler.config-with-version.ts',
        cwd: import.meta.dirname,
      })
      expect(config).toMatchInlineSnapshot(`
{
  "config-provider": {
    "preset": {
      "include": [
        "nushell",
      ],
      "version": "0.0.0",
    },
  },
}
`)
    })
  })
})
