import { describe, expect, it } from 'bun:test'
import { HandlerError } from '../../../src/command/preset/error'

describe('error test', () => {
  it('should throw error', () => {
    expect(() => {
      throw new HandlerError('This is a test error')
    }).toThrow('This is a test error')
  })

  it('should have correct name', () => {
    try {
      throw new HandlerError('This is a test error')
    }
    catch (error) {
      expect(error).toBeInstanceOf(HandlerError)
      expect(error.name).toBe('HandlerError')
    }
  })
})
