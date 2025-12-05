import { $ } from 'bun'
import { assert, describe, it } from 'vitest'

describe('bash profile tests', () => {
  it('should pass', async () => {
    $.cwd(import.meta.dirname)
    const proc = $`bash ./test.sh --silent`
    const result = (await proc.text()).split('\n')
    assert.equal(result[0], result[1])
    assert.equal(result[2], '0')
  })
})
