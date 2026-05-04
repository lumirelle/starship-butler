import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { removeUserRc, writeUserRc } from 'starship-butler-utils/config'
import { readUserRc, upsertUserRc } from '../../../src/command/utils'

// Avoid name conflict with the test in the utils package
const configFileName = '.testbutlerrc2'

beforeEach(() => {
  // Initialize an example rc file for testing
  writeUserRc({ 'config-provider': { version: '1.0.0' } }, { name: configFileName })
})
afterEach(() => {
  // Remove the example rc file after each test
  removeUserRc({ name: configFileName })
})

describe('rc9', () => {
  describe('readUserRc()', () => {
    it('should load user rc file', () => {
      expect(readUserRc({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "version": "1.0.0",
          }
        `)
    })
  })

  describe('upsertUserRc()', () => {
    it('should upsert user rc file correctly', () => {
      expect(readUserRc({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "version": "1.0.0",
          }
        `)

      removeUserRc({ name: configFileName })
      expect(readUserRc({ name: configFileName })).toEqual({})

      upsertUserRc({ test: 123 }, { name: configFileName })
      expect(readUserRc({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "test": 123,
          }
        `)

      upsertUserRc({ foo: 'bar' }, { name: configFileName })
      expect(readUserRc({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "foo": "bar",
            "test": 123,
          }
        `)
    })
  })
})
