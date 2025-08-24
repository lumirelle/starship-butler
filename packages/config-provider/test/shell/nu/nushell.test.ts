import { x } from 'tinyexec'
import { assert, describe, it } from 'vitest'

describe('assets/shell/nu', () => {
  it('utils', async () => {
    const proc = x('nu', ['./test.nu', '--silent'], {
      nodeOptions: {
        cwd: import.meta.dirname,
      },
    })
    const result: string[] = []
    for await (const line of proc) {
      result.push(line)
    }
    // Result[0] = total tests
    // Result[1] = passed tests
    // Result[2] = failed tests
    assert.equal(result[0], result[1])
    assert.equal(result[2], '0')
  })
})
