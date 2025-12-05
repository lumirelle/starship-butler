import { $ } from 'bun'
import { assert, describe, it } from 'vitest'

describe('nushell profile tests', () => {
  it('should pass', async () => {
    $.cwd(import.meta.dirname)
    const proc = $`nu ./test.nu --silent`
    const result = (await proc.text()).split('\n')
    assert.equal(result[0], result[1])
    assert.equal(result[2], '0')
  })
})
