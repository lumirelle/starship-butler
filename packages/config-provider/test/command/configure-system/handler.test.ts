import { describe, expect, it } from 'bun:test'
import { checkPlatformSupport, checkTargetExist } from '../../../src/command/configure-system/handler'

const fixtureDir = import.meta.dirname

describe('handler', () => {
  it('should return true with supported platform', () => {
    expect(checkPlatformSupport(['win32', 'linux', 'darwin'], 'win32')).toBe(true)
  })

  it('should return false with unsupported platform', () => {
    expect(checkPlatformSupport(['win32', 'linux', 'darwin'], 'aix')).toBe(false)
  })

  it('should return false with empty target', () => {
    expect(checkTargetExist([])).toBe(false)
  })

  it('should return true with existing target', () => {
    expect(checkTargetExist([`${fixtureDir}/actions.test.ts`])).toBe(true)
  })

  it('should return true with multiple existing targets', () => {
    expect(checkTargetExist([`${fixtureDir}/actions.test.ts`, `${fixtureDir}/handler.test.ts`])).toBe(true)
  })

  it('should return false with non-existing target', () => {
    expect(checkTargetExist([`${fixtureDir}/not-exist-folder`])).toBe(false)
  })
})
