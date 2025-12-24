import { describe, expect, it } from 'bun:test'
import { version } from '../package.json'
import { readUserRc } from '../src/config'

describe('config utils', () => {
  it('should load rc file correctly', () => {
    const rc = readUserRc()
    expect(rc).toMatchInlineSnapshot(`
      {
        "config-provider": {
          "version": "${version}",
        },
      }
    `)
  })
})
