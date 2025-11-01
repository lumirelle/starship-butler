import { describe, expect, it } from 'vitest'
import { stringify } from '../src/stringify'

describe('stringify', () => {
  it('should work with object containing functions correctly', () => {
    expect(stringify({
      testFn: () => {
        // eslint-disable-next-line no-console
        console.log('test function')
      },
    })).toEqual(`{
  "testFn": "() => { console.log('test function'); }"
}`)
  })
})
