import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { removeUserConfig, writeUserConfig } from 'starship-butler-utils/config'
import { ensureDirectory } from 'starship-butler-utils/fs'
import { homedir } from 'starship-butler-utils/path'
import { isCI } from 'std-env'
import { readUserConfig, upsertUserConfig } from '../../../src/command/utils'

// Avoid name conflict with the test in the utils package
const configFileName = '.testbutlerrc2'

beforeAll(() => {
  // Some CI environments (like GitHub Actions) may not have a config directory, which will cause the test to fail. So we need to ensure the config directory exist before testing.
  if (isCI)
    ensureDirectory(homedir('.config'))
})
beforeEach(() => {
  // Initialize an example rc file for testing
  writeUserConfig({ 'config-provider': { version: '1.0.0' } }, { name: configFileName })
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
            "version": "1.0.0",
          }
        `)
    })
  })

  describe('upsertUserConfig()', () => {
    it('should upsert user rc file correctly', () => {
      expect(readUserConfig({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "version": "1.0.0",
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
})
