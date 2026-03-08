import { describe, it } from 'bun:test'
import { join } from 'pathe'
import { ASSETS_FOLDER, PKG_ROOT } from '../src/constants'

describe('Constants', () => {
  it('should have the correct PKG_ROOT', () => {
    const expectedPath = join(import.meta.dirname, '..')
    if (PKG_ROOT !== expectedPath) {
      throw new Error(`PKG_ROOT is incorrect. Expected: ${expectedPath}, Actual: ${PKG_ROOT}`)
    }
  })

  it('should have the correct ASSETS_FOLDER', () => {
    const expectedPath = join(import.meta.dirname, '..', 'assets')
    if (ASSETS_FOLDER !== expectedPath) {
      throw new Error(`ASSETS_FOLDER is incorrect. Expected: ${expectedPath}, Actual: ${ASSETS_FOLDER}`)
    }
  })
})
