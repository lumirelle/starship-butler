import { describe, expect, it } from 'bun:test'
import { exists, remove } from 'starship-butler-utils/fs'
import { ensureDirectoryExist, isPathExist, isPathExistEnv } from '../../../../src/command/preset/actions/utils'

const fixtureDir = import.meta.dirname

describe('action utils', () => {
  it('isPathExist should work', () => {
    const existingPath = fixtureDir
    const nonExistingPath = `${fixtureDir}/non-existing-file.txt`

    expect(isPathExist(existingPath)).toBe(true)
    expect(isPathExist(nonExistingPath)).toBe(false)
    expect(isPathExist([existingPath, nonExistingPath])).toBe(false)
  })

  it('isPathExistEnv should work', async () => {
    const existingCommand = 'bun'
    const nonExistingCommand = 'non-existing-command-xyz'

    expect(await isPathExistEnv(existingCommand)).toBe(true)
    expect(await isPathExistEnv(nonExistingCommand)).toBe(false)
  })

  it('ensureDirectoryExist should work', async () => {
    const testDir = `${fixtureDir}/temp-test-dir/subdir`

    // Ensure the directory does not exist before the test
    if (exists(testDir)) {
      remove(testDir, true)
    }

    ensureDirectoryExist(testDir)
    const isExists = exists(testDir)
    expect(isExists).toBe(true)

    // Clean up
    remove(`${fixtureDir}/temp-test-dir`, true)
  })
})
