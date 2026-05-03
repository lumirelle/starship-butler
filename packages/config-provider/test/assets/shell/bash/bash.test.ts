import { $ } from 'bun'
import { describe, expect, it } from 'bun:test'
import { platform } from 'node:os'
import { x } from 'tinyexec'
import { isPathExistEnv } from '../../../../src/command/preset/actions/utils'

const isBashAvailable = await isPathExistEnv('bash')

describe('bash profile tests', () => {
  it.if(isBashAvailable)('should pass', async () => {
    $.cwd(import.meta.dirname)
    // XXX(Lumirelle): Because of Bun's shell cannot find bash.exe in Windows,
    // we have to use tinyexec to test the bash profile.
    const proc = await x('bash', ['./test.sh', '--silent'])
    const result = proc.stdout.split('\n')
    expect(result[0]).toBe(result[1])
    expect(result[2]).toBe('0')
  }, platform() === 'win32' ? 10_000 : 5000)
})
