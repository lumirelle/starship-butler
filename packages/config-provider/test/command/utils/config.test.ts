import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { consola } from 'consola'
import * as configUtils from '../../../src/command/utils/config'

describe('config utilities', () => {
  describe('processConfig', () => {
    const spiedCopyPasteConfig = spyOn(configUtils, '_copyPasteConfig')
    const spiedSymlinkConfig = spyOn(configUtils, '_symlinkConfig')
    const spiedConsolaSuccess = spyOn(consola, 'success')

    beforeEach(() => {
      spiedCopyPasteConfig.mockImplementation(() => true)
      spiedSymlinkConfig.mockImplementation(() => true)
    })

    afterEach(() => {
      spiedCopyPasteConfig.mockReset()
      spiedSymlinkConfig.mockReset()
      spiedConsolaSuccess.mockReset()
    })

    it('should call _copyPasteConfig with the correct arguments', () => {
      configUtils.processConfig('source', 'target', { mode: 'copy-paste' })
      expect(spiedCopyPasteConfig).toBeCalledWith('source', 'target', { mode: 'copy-paste' })
      expect(spiedCopyPasteConfig).toBeCalledTimes(1)
    })

    it('should call consola.success() once after _copyPasteConfig resolves to true', () => {
      configUtils.processConfig('source', 'target', { mode: 'copy-paste' })
      expect(spiedConsolaSuccess).toBeCalledTimes(1)
    })

    it('should not call consola.success() if _copyPasteConfig resolves to false', () => {
      spiedCopyPasteConfig.mockImplementation(() => false)
      configUtils.processConfig('source', 'target', { mode: 'copy-paste' })
      expect(spiedConsolaSuccess).toBeCalledTimes(0)
    })

    it('should call _symlinkConfig with the correct arguments', () => {
      configUtils.processConfig('source', 'target', { mode: 'symlink' })
      expect(spiedSymlinkConfig).toBeCalledWith('source', 'target', { mode: 'symlink' })
      expect(spiedSymlinkConfig).toBeCalledTimes(1)
    })

    it('should call consola.success() once after _symlinkConfig resolves to true', () => {
      configUtils.processConfig('source', 'target', { mode: 'symlink' })
      expect(spiedConsolaSuccess).toBeCalledTimes(1)
    })

    it('should not call consola.success() if _symlinkConfig resolves to false', () => {
      spiedSymlinkConfig.mockImplementation(() => false)
      configUtils.processConfig('source', 'target', { mode: 'symlink' })
      expect(spiedConsolaSuccess).toBeCalledTimes(0)
    })
  })

  // TODO(Lumirelle): Add more tests
})
