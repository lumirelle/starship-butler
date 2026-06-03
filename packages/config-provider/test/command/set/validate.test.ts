import { describe, expect, it } from 'vitest'
import { validateOptions } from '../../../src/command/set/validate'

describe('validate', () => {
  describe('validateOptions()', () => {
    it('should return true with valid options', () => {
      expect(validateOptions({})).toBe(true)
    })
    it('should return false with invalid mode', () => {
    // @ts-expect-error Test invalid mode
      expect(validateOptions({ mode: 'invalid' })).toBe(false)
    })
  })
})
