import { describe, expect, it } from 'vitest'
import { stringify } from './utils'

describe('should', () => {
  it('stringify function correctly', () => {
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
