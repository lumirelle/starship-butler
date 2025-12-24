import { describe, expect, it } from 'bun:test'
import { bold, cyan, important, info, magenta } from '../src/highlight'

describe('highlight util tests', () => {
  it('should show info text with cyan color', () => {
    expect(info('test')).toBe(cyan('test'))
  })

  it('should show important text with magenta and bold', () => {
    expect(important('test')).toBe(bold(magenta('test')))
  })
})
