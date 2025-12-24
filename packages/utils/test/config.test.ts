import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { version } from '../package.json'
import { loadConfig, readUserRc, removeUserRc, updateUserRc, upsertUserRc, writeUserRc } from '../src/config'

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

describe('config utils', () => {
  it('should load user rc file correctly', () => {
    const rc = readUserRc()
    expect(rc).toMatchInlineSnapshot(`
      {
        "config-provider": {
          "version": "${version}",
        },
      }
    `)
  })

  it('should write user rc file correctly', () => {
    writeUserRc({ test: 123 })
    const rc = readUserRc()
    expect(rc).toMatchInlineSnapshot(`
      {
        "test": 123,
      }
    `)
  })

  it('should update user rc file correctly', () => {
    const updatedRc = updateUserRc({ foo: 'bar' })
    expect(updatedRc).toMatchInlineSnapshot(`
      {
        "config-provider": {
          "version": "${version}",
        },
        "foo": "bar",
      }
    `)
  })

  it('should remove user rc file correctly', () => {
    removeUserRc()
    expect(readUserRc()).toEqual({})
  })

  it('should upsert user rc file correctly', () => {
    removeUserRc()
    upsertUserRc({ test: 123 })
    expect(readUserRc()).toMatchInlineSnapshot(`
      {
        "test": 123,
      }
    `)
    upsertUserRc({ foo: 'bar' })
    expect(readUserRc()).toMatchInlineSnapshot(`
      {
        "foo": "bar",
        "test": 123,
      }
    `)
  })

  it('should load user config without user rc file by default', async () => {
    const { config } = await loadConfig({
      cwd: import.meta.dirname,
    })
    expect(config).toMatchInlineSnapshot(`
        {
          "test": 123,
        }
      `)
  })
})
