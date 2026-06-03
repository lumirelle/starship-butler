import { join } from 'pathe'
import { describe, expect, it } from 'vitest'
import { ASSETS_FOLDER, PKG_ROOT } from '../src/constants'

describe('constants', () => {
  describe('$PKG_ROOT', () => {
    it('should be correct', () => {
      const expectedPath = join(import.meta.dirname, '..')
      if (PKG_ROOT !== expectedPath) {
        throw new Error(`PKG_ROOT is incorrect. Expected: ${expectedPath}, Actual: ${PKG_ROOT}`)
      }
      expect(PKG_ROOT).toBe(expectedPath)
    })
  })

  describe('$ASSETS_FOLDER', () => {
    it('should be correct', () => {
      const expectedPath = join(import.meta.dirname, '..', 'assets')
      if (ASSETS_FOLDER !== expectedPath) {
        throw new Error(`ASSETS_FOLDER is incorrect. Expected: ${expectedPath}, Actual: ${ASSETS_FOLDER}`)
      }
      expect(ASSETS_FOLDER).toBe(expectedPath)
    })
  })
})
