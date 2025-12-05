import { platform } from 'node:os'
import { $ } from 'bun'
import { describe, expect, it } from 'bun:test'

describe('bash profile tests', () => {
  it('should pass', async () => {
    $.cwd(import.meta.dirname)
    const proc = $`bash ./test.sh --silent`
    const result = (await proc.text()).split('\n')
    expect(result[0]).toBe(result[1])
    expect(result[2]).toBe('0')
  }, platform() === 'win32' ? 10_000 : 5000)
})
