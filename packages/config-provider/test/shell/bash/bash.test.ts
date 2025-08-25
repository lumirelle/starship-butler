import { x } from 'tinyexec'
import { assert, it } from 'vitest'

it('bash', async () => {
  const proc = x('bash', ['./test.sh', '--silent'], {
    nodeOptions: {
      cwd: import.meta.dirname,
    },
  })
  const result: number[] = []
  for await (const line of proc) {
    result.push(+line)
  }
  // Result[0] = total tests
  // Result[1] = passed tests
  // Result[2] = failed tests
  assert.equal(result[0], result[1])
  assert.equal(result[2], 0)
})
