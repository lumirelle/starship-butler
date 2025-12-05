import { describe, expect, it } from 'bun:test'
import { validateOptions } from '../../../src/command/configure/validate'

describe('validator', () => {
  it('should return true with valid options', () => {
    expect(validateOptions({})).toBe(true)
  })
  it('should return false with invalid mode', () => {
    // @ts-expect-error - invalid mode
    expect(validateOptions({ mode: 'invalid' })).toBe(false)
  })
})
