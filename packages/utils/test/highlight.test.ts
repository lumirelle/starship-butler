import { describe, expect, it } from 'bun:test'
import { styleText } from 'node:util'
import { important, info } from '../src/highlight'

describe('highlight util tests', () => {
  it('should show info text with cyan color', () => {
    expect(info('test')).toBe(styleText(['cyan'], 'test'))
  })

  it('should show important text with magenta and bold', () => {
    expect(important('test')).toBe(styleText(['bold', 'magenta'], 'test'))
  })

  it('should show success text with green color', () => {
    const success = (v: string): string => {
      return styleText(['green'], v)
    }
    expect(success('test')).toBe(styleText(['green'], 'test'))
  })
})
