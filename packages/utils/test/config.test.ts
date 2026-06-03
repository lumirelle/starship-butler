import { isCI } from 'std-env'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { version } from '../package.json'
import {
  loadConfig,
  readUserConfig,
  removeUserConfig,
  updateUserConfig,
  upsertUserConfig,
  writeUserConfig,
} from '../src/config'
import { ensureDirectory } from '../src/fs'
import { homedir } from '../src/path'

const configFileName = '.testbutlerrc'

describe('config util', () => {
  beforeAll(() => {
    // Some CI environments (like GitHub Actions) may not have a config directory, which will cause the test to fail. So we need to ensure the config directory exist before testing.
    if (isCI)
      ensureDirectory(homedir('.config'))
  })
  beforeEach(() => {
    // Initialize an example rc file for testing
    writeUserConfig({ 'config-provider': { version } }, { name: configFileName })
  })
  afterEach(() => {
    // Remove the example rc file after each test
    removeUserConfig({ name: configFileName })
  })

  describe('rc9', () => {
    describe('readUserConfig()', () => {
      it('should load user rc file', () => {
        expect(readUserConfig({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "config-provider": {
              "version": "${version}",
            },
          }
        `)
      })
    })

    describe('writeUserConfig()', () => {
      it('should write to user rc file', () => {
        expect(readUserConfig({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "config-provider": {
              "version": "${version}",
            },
          }
        `)
        writeUserConfig({ test: 123 }, { name: configFileName })
        expect(readUserConfig({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "test": 123,
          }
        `)
      })
    })

    describe('updateUserConfig()', () => {
      it('should update user rc file correctly', () => {
        expect(readUserConfig({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "config-provider": {
              "version": "${version}",
            },
          }
        `)
        expect(updateUserConfig({ foo: 'bar' }, { name: configFileName })).toMatchInlineSnapshot(`
          {
            "config-provider": {
              "version": "${version}",
            },
            "foo": "bar",
          }
        `)
      })
    })

    describe('upsertUserConfig()', () => {
      it('should upsert user rc file correctly', () => {
        expect(readUserConfig({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "config-provider": {
              "version": "${version}",
            },
          }
        `)

        removeUserConfig({ name: configFileName })
        expect(readUserConfig({ name: configFileName })).toEqual({})

        upsertUserConfig({ test: 123 }, { name: configFileName })
        expect(readUserConfig({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "test": 123,
          }
        `)

        upsertUserConfig({ foo: 'bar' }, { name: configFileName })
        expect(readUserConfig({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "foo": "bar",
            "test": 123,
          }
        `)
      })
    })

    describe('removeUserConfig()', () => {
      it('should remove user rc file correctly', () => {
        expect(readUserConfig({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "config-provider": {
              "version": "${version}",
            },
          }
        `)
        removeUserConfig({ name: configFileName })
        expect(readUserConfig({ name: configFileName })).toEqual({})
      })
    })
  })

  describe('c12', () => {
    describe('loadConfig()', () => {
      it('should load user config & ignore user rc file', async () => {
        expect(readUserConfig({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "config-provider": {
              "version": "${version}",
            },
          }
        `)

        const { config } = await loadConfig({
          configFile: './fixtures/butler.config.json',
          cwd: import.meta.dirname,
        })
        expect(config).toMatchInlineSnapshot(`
          {
            "test": 123,
          }
        `)
      })
    })
  })
})
