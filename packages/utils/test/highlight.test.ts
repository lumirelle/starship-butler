import { styleText } from 'node:util'
import { describe, expect, it } from 'vitest'
import { important, info } from '../src/highlight'

describe('highlight util', () => {
  describe('info()', () => {
    it('should display text with cyan color', () => {
      expect(info('test')).toBe(styleText(['cyan'], 'test'))
    })
  })

  describe('important()', () => {
    it('should display text with magenta color and bold weight', () => {
      expect(important('test')).toBe(styleText(['bold', 'magenta'], 'test'))
    })
  })

  describe('success()', () => {
    it('should display text with green color', () => {
      const success = (v: string): string => styleText(['green'], v)
      expect(success('test')).toBe(styleText(['green'], 'test'))
    })
  })
})
