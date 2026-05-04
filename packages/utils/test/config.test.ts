import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { version } from '../package.json'
import {
  loadConfig,
  readUserRc,
  removeUserRc,
  updateUserRc,
  upsertUserRc,
  writeUserRc,
} from '../src/config'

const configFileName = '.testbutlerrc'

describe('config util', () => {
  beforeEach(() => {
    // Initialize an example rc file for testing
    writeUserRc({ 'config-provider': { version } }, { name: configFileName })
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
            "config-provider": {
              "version": "${version}",
            },
          }
        `)
      })
    })

    describe('writeUserRc()', () => {
      it('should write to user rc file', () => {
        expect(readUserRc({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "config-provider": {
              "version": "${version}",
            },
          }
        `)
        writeUserRc({ test: 123 }, { name: configFileName })
        expect(readUserRc({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "test": 123,
          }
        `)
      })
    })

    describe('updateUserRc()', () => {
      it('should update user rc file correctly', () => {
        expect(readUserRc({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "config-provider": {
              "version": "${version}",
            },
          }
        `)
        expect(updateUserRc({ foo: 'bar' }, { name: configFileName })).toMatchInlineSnapshot(`
          {
            "config-provider": {
              "version": "${version}",
            },
            "foo": "bar",
          }
        `)
      })
    })

    describe('removeUserRc()', () => {
      it('should remove user rc file correctly', () => {
        expect(readUserRc({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "config-provider": {
              "version": "${version}",
            },
          }
        `)
        removeUserRc({ name: configFileName })
        expect(readUserRc({ name: configFileName })).toEqual({})
      })
    })

    describe('upsertUserRc()', () => {
      it('should upsert user rc file correctly', () => {
        expect(readUserRc({ name: configFileName })).toMatchInlineSnapshot(`
          {
            "config-provider": {
              "version": "${version}",
            },
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

  describe('c12', () => {
    describe('loadConfig()', () => {
      it('should load user config & ignore user rc file', async () => {
        expect(readUserRc({ name: configFileName })).toMatchInlineSnapshot(`
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
