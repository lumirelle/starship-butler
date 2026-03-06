import { $ } from 'bun'
import { describe, expect, it } from 'bun:test'
import { platform } from 'node:os'
import { isPathExistEnv } from '../../../../src/command/preset/actions/utils'

const isBashAvailable = await isPathExistEnv('bash')

describe('bash profile tests', () => {
  it.if(isBashAvailable)(
    'should pass',
    async () => {
      $.cwd(import.meta.dirname)
      const proc = $`nu ./test.nu --silent`
      const result = (await proc.text()).split('\n')
      expect(result[0]).toBe(result[1])
      expect(result[2]).toBe('0')
    },
    platform() === 'win32' ? 10_000 : 5000,
  )
})
