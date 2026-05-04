import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { consola } from 'consola'

describe('config util', () => {
  describe('copyPasteConfig()', async () => {
    it('should return false if useGlob is true', async () => {
      const { copyPasteConfig } = await import('../../../src/command/utils/config')
      const result = copyPasteConfig('source', 'target', { useGlob: true })
      expect(result).toBe(false)
    })
  })

  describe('symlinkConfig()', async () => {
    it('should return false if useGlob is true', async () => {
      const { symlinkConfig } = await import('../../../src/command/utils/config')
      const result = symlinkConfig('source', 'target', { useGlob: true })
      expect(result).toBe(false)
    })
  })

  describe('processConfig()', async () => {
    const configUtils = await import('../../../src/command/utils/config')
    let copyPasteConfigSpy: Mock<typeof import('../../../src/command/utils/config')['copyPasteConfig']>
    let symlinkConfigSpy: Mock<typeof import('../../../src/command/utils/config')['symlinkConfig']>

    beforeEach(() => {
      copyPasteConfigSpy = spyOn(configUtils, 'copyPasteConfig').mockImplementation(() => true)
      symlinkConfigSpy = spyOn(configUtils, 'symlinkConfig').mockImplementation(() => true)
    })
    afterEach(() => {
      copyPasteConfigSpy.mockRestore()
      symlinkConfigSpy.mockRestore()
    })

    describe('copy-paste mode', () => {
      it('should call copyPasteConfig()', () => {
        configUtils.processConfig('source', 'target', { mode: 'copy-paste' })
        expect(copyPasteConfigSpy).toBeCalledWith('source', 'target', { mode: 'copy-paste' })
        expect(copyPasteConfigSpy).toBeCalledTimes(1)
      })

      it('should not call symlinkConfig()', () => {
        configUtils.processConfig('source', 'target', { mode: 'copy-paste' })
        expect(symlinkConfigSpy).not.toBeCalled()
      })

      it('should log success if copyPasteConfig() resolves to true', () => {
        const spy = spyOn(consola, 'success')

        configUtils.processConfig('source', 'target', { mode: 'copy-paste' })
        expect(spy).toBeCalledTimes(1)

        spy.mockRestore()
      })

      it('should not log success if copyPasteConfig() resolves to false', () => {
        const spy = spyOn(consola, 'success')

        copyPasteConfigSpy.mockImplementation(() => false)
        configUtils.processConfig('source', 'target', { mode: 'copy-paste' })
        expect(spy).toBeCalledTimes(0)

        spy.mockRestore()
      })
    })

    describe('symlink mode', () => {
      it('should call symlinkConfig() ', () => {
        configUtils.processConfig('source', 'target', { mode: 'symlink' })
        expect(symlinkConfigSpy).toBeCalledWith('source', 'target', { mode: 'symlink' })
        expect(symlinkConfigSpy).toBeCalledTimes(1)
      })

      it('should not call copyPasteConfig() ', () => {
        configUtils.processConfig('source', 'target', { mode: 'symlink' })
        expect(copyPasteConfigSpy).not.toBeCalled()
      })

      it('should log success if symlinkConfig() resolves to true', () => {
        const spy = spyOn(consola, 'success')

        configUtils.processConfig('source', 'target', { mode: 'symlink' })
        expect(spy).toBeCalledTimes(1)

        spy.mockRestore()
      })

      it('should not log success if symlinkConfig() resolves to false', () => {
        const spy = spyOn(consola, 'success')

        symlinkConfigSpy.mockImplementation(() => false)
        configUtils.processConfig('source', 'target', { mode: 'symlink' })
        expect(spy).toBeCalledTimes(0)

        spy.mockRestore()
      })
    })
  })

  // TODO(Lumirelle): Add more tests
})
