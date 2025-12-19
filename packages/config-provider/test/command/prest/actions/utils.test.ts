import { describe, expect, it } from 'bun:test'
import { homedir as osHomedir, platform } from 'node:os'
import { fs } from 'starship-butler-utils'
import { appdata, ensureDirectoryExist, homedir, isPathExist, isPathExistEnv, localAppdata } from '../../../../src/command/preset/actions/utils'

const fixtureDir = import.meta.dirname

describe('action utils', () => {
  it('homedir should work', () => {
    const path = homedir('.config', 'test')
    expect(path).toBe(`${osHomedir().replace(/\\/g, '/')}/.config/test`)
  })

  it.if(platform() === 'win32')('appdata should work', () => {
    const path = appdata('test', 'appdata')
    expect(path).toBe(`${process.env.APPDATA?.replace(/\\/g, '/')}/test/appdata`)
  })

  it.if(platform() === 'win32')('localAppdata should work', () => {
    const path = localAppdata('test', 'localappdata')
    expect(path).toBe(`${process.env.LOCALAPPDATA?.replace(/\\/g, '/')}/test/localappdata`)
  })

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
    if (fs.exists(testDir)) {
      fs.remove(testDir, true)
    }

    ensureDirectoryExist(testDir)
    const exists = fs.exists(testDir)
    expect(exists).toBe(true)

    // Clean up
    fs.remove(`${fixtureDir}/temp-test-dir`, true)
  })
})
