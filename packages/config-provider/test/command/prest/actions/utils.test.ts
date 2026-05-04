import { describe, expect, it } from 'bun:test'
import { exists, remove } from 'starship-butler-utils/fs'
import {
  ensureDirectoryExist,
  isPathExist,
  isPathExistEnv,
} from '../../../../src/command/preset/actions/utils'

const dirname = import.meta.dirname

describe('preset command action utils', () => {
  describe('isPathExist()', () => {
    it('should work', () => {
      const existingPath = dirname
      const nonExistingPath = `${dirname}/non-existing-file.txt`

      expect(isPathExist(existingPath)).toBe(true)
      expect(isPathExist(nonExistingPath)).toBe(false)
      expect(isPathExist([existingPath, nonExistingPath])).toBe(false)
    })
  })

  describe('isPathExistEnv()', () => {
    it('should work', async () => {
      const existingCommand = 'bun'
      const nonExistingCommand = 'non-existing-command-xyz'

      expect(await isPathExistEnv(existingCommand)).toBe(true)
      expect(await isPathExistEnv(nonExistingCommand)).toBe(false)
    })
  })

  describe('ensureDirectoryExist()', () => {
    it('should work', () => {
      const testDir = `${dirname}/temp-test-dir/subdir`

      expect(exists(testDir)).toBe(false)
      ensureDirectoryExist(testDir)
      expect(exists(testDir)).toBe(true)

      // Clean up
      remove(`${dirname}/temp-test-dir`, true)
    })
  })
})
