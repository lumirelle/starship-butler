import { $ } from 'bun'
import { describe, expect, it } from 'bun:test'
import { isPathExistEnv } from '../../../../src/command/preset/actions/utils'

describe('nushell profile tests', async () => {
  it.if(await isPathExistEnv('nu'))('should pass', async () => {
    $.cwd(import.meta.dirname)
    const proc = $`nu ./test.nu --silent`
    const result = (await proc.text()).split('\n')
    expect(result[0]).toBe(result[1])
    expect(result[2]).toBe('0')
  })
})
