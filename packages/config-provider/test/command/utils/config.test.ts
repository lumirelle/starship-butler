import { consola } from 'consola'
import { join } from 'pathe'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { processConfig } from '../../../src/command/utils'
import { ASSETS_FOLDER } from '../../../src/constants'

// Mock fs functions, let them return true
const { copyFile, createSymlink } = vi.hoisted(() => ({
  copyFile: vi.fn(() => true),
  createSymlink: vi.fn(() => true),
}))
vi.mock('starship-butler-utils/fs', () => ({
  copyFile,
  createSymlink,
}))

describe('config util', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('copyPasteConfig()', async () => {
    it('should return false if useGlob is true, so it should not log success', async () => {
      const spy = vi.spyOn(consola, 'success')
      processConfig('source', 'target', { useGlob: true })
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('symlinkConfig()', async () => {
    it('should return false if useGlob is true, so it should not log success', async () => {
      const spy = vi.spyOn(consola, 'success')
      processConfig('source', 'target', { useGlob: true })
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('processConfig()', async () => {
    describe('copy-paste mode', () => {
      it('should call copyFile()', async () => {
        processConfig('source', 'target', { mode: 'copy-paste' })
        expect(copyFile).toHaveBeenCalledWith(join(ASSETS_FOLDER, 'source'), 'target', undefined)
        expect(copyFile).toHaveBeenCalledTimes(1)
      })

      it('should not call createSymlink()', () => {
        processConfig('source', 'target', { mode: 'copy-paste' })
        expect(createSymlink).not.toHaveBeenCalled()
      })

      it('should log success if copyFile() resolves to true', () => {
        const spy = vi.spyOn(consola, 'success')
        processConfig('source', 'target', { mode: 'copy-paste' })
        expect(spy).toHaveBeenCalledTimes(1)
      })

      it('should not log success if copyFile() resolves to false', () => {
        const spy = vi.spyOn(consola, 'success')
        copyFile.mockImplementationOnce(() => false)
        processConfig('source', 'target', { mode: 'copy-paste' })
        expect(spy).toHaveBeenCalledTimes(0)
      })
    })

    describe('symlink mode', () => {
      it('should call createSymlin() ', () => {
        processConfig('source', 'target', { mode: 'symlink' })
        expect(createSymlink).toHaveBeenCalledWith(join(ASSETS_FOLDER, 'source'), 'target', undefined)
        expect(createSymlink).toHaveBeenCalledTimes(1)
      })

      it('should not call copyFile() ', () => {
        processConfig('source', 'target', { mode: 'symlink' })
        expect(copyFile).not.toHaveBeenCalled()
      })

      it('should log success if createSymlink() resolves to true', () => {
        const spy = vi.spyOn(consola, 'success')
        processConfig('source', 'target', { mode: 'symlink' })
        expect(spy).toHaveBeenCalledTimes(1)
      })

      it('should not log success if createSymlink() resolves to false', () => {
        const spy = vi.spyOn(consola, 'success')

        createSymlink.mockImplementationOnce(() => false)
        processConfig('source', 'target', { mode: 'symlink' })
        expect(spy).toHaveBeenCalledTimes(0)
      })
    })
  })

  // TODO(Lumirelle): Add more tests
})
