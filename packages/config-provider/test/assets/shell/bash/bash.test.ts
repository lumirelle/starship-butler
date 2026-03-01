import { describe, expect, it } from 'bun:test'
import { platform } from 'node:os'
import { x } from 'tinyexec'
import { isPathExistEnv } from '../../../../src/command/preset/actions/utils'

const isBashAvailable = await isPathExistEnv('bash')

describe('bash profile tests', () => {
  // FIXME(Lumirelle): As bun has bug on finding bash in windows env, we use tinyexec as workaround
  it.if(isBashAvailable)(
    'should pass',
    async () => {
      const output = await x('bash', ['./test.sh', '--silent'], {
        nodeOptions: {
          cwd: import.meta.dirname,
        },
      })
      const result = output.stdout.trim().split('\n')
      expect(result[0]).toBe(result[1])
      expect(result[2]).toBe('0')
    },
    platform() === 'win32' ? 10_000 : 5000,
  )
})
