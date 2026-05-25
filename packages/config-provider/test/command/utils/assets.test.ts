import { describe, expect, it } from 'bun:test'
import { normalizeAssetFilename } from '../../../src/command/utils/assets'

describe('assets', () => {
  describe('normalizeAssetFilename()', () => {
    it('should remove leading underscores from the filename', () => {
      const filename = '_eslint.config.js'
      const normalized = normalizeAssetFilename(filename)
      expect(normalized).toBe('eslint.config.js')
    })

    it('should remove leading underscores from the filepath', () => {
      const filepath = 'C:\\Users\\xxx\\_eslint.config.js'
      const normalized = normalizeAssetFilename(filepath)
      expect(normalized).toBe('C:\\Users\\xxx\\eslint.config.js')
    })

    it('should not change the filename if there are no leading underscores', () => {
      const filename = 'eslint.config.js'
      const normalized = normalizeAssetFilename(filename)
      expect(normalized).toBe('eslint.config.js')
    })

    it('should not change the filepath if there are no leading underscores', () => {
      const filepath = 'C:\\Users\\xxx\\eslint.config.js'
      const normalized = normalizeAssetFilename(filepath)
      expect(normalized).toBe('C:\\Users\\xxx\\eslint.config.js')
    })

    it('should only remove leading underscores in filename', () => {
      const filename = '_es_lin_t.config.js'
      const normalized = normalizeAssetFilename(filename)
      expect(normalized).toBe('es_lin_t.config.js')
    })

    it('should only remove leading underscores in filepath', () => {
      const filepath = 'C:\\Users\\_xxx\\_es_lin_t.config.js'
      const normalized = normalizeAssetFilename(filepath)
      expect(normalized).toBe('C:\\Users\\_xxx\\es_lin_t.config.js')
    })
  })
})
