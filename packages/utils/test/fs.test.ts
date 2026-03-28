import { afterAll, beforeAll, describe, expect, it, mock, spyOn } from 'bun:test'
import fs from 'node:fs'
import { consola } from 'consola'
import {
  copyFile,
  createSymlink,
  ensureDirectory,
  exists,
  isDirectory,
  isSymbolicLink,
  remove,
  removeSymlink,
} from '../src/fs'
import { info } from '../src/highlight'

function dirname(path: string): string {
  return `${import.meta.dirname}/${path}`
}

beforeAll(() => {
  ensureDirectory(dirname('fixtures/tmp/'))
  createSymlink(dirname('fixtures/butler.config.json'), dirname('fixtures/symlink-to-config'))
})

afterAll(() => {
  remove(dirname('fixtures/tmp/'), true)
  remove(dirname('fixtures/symlink-to-config'))
  if (exists(dirname('fixtures/ensuring-directory/'))) {
    remove(dirname('fixtures/ensuring-directory/'), true)
  }
})

describe('fs util tests', () => {
  it('should check path exists correctly', () => {
    // Existent paths
    expect(exists(dirname('fixtures'))).toBe(true)
    expect(exists(dirname('fixtures/'))).toBe(true)
    expect(exists(dirname('fixtures/butler.config.json'))).toBe(true)
    // Non existent paths
    // If it's a file but ends with `/` or `\`, we consider it does not exist, in order to let the behavior on Windows be consistent with Unix
    expect(exists(dirname('fixtures/butler.config.json/'))).toBe(false)
    expect(exists(dirname('fixtures/non-existent-folder'))).toBe(false)
    expect(exists(dirname('fixtures/non-existent-folder/'))).toBe(false)
    expect(exists(dirname('fixtures/non-existent-file.txt'))).toBe(false)
    expect(exists(dirname('fixtures/non-existent-file.txt/'))).toBe(false)
  })

  it('should check a path is directory correctly', () => {
    // Existent paths
    expect(isDirectory(dirname('fixtures'))).toBe(true)
    expect(isDirectory(dirname('fixtures/'))).toBe(true)
    expect(isDirectory(dirname('fixtures/butler.config.json'))).toBe(false)
    // Non existent paths
    expect(isDirectory(dirname('fixtures/butler.config.json/'))).toBe(true)
    expect(isDirectory(dirname('fixtures/non-existent-folder/'))).toBe(true)
    expect(isDirectory(dirname('fixtures/non-existent-file'))).toBe(false)
  })

  it('should check a path is symbolic link correctly', () => {
    // Existent paths
    expect(isSymbolicLink(dirname('fixtures/symlink-to-config'))).toBe(true)
    expect(isSymbolicLink(dirname('fixtures/butler.config.json'))).toBe(false)
    // Non existent paths
    expect(isSymbolicLink(dirname('fixtures/non-existent-symlink'))).toBe(false)
    expect(isSymbolicLink(dirname('fixtures/non-existent-file'))).toBe(false)
  })

  it('should ensure directory correctly', () => {
    // Existent directory
    expect(ensureDirectory(dirname('fixtures/'))).toBe(true)
    // Existent file
    expect(ensureDirectory(dirname('fixtures/butler.config.json'))).toBe(false)
    // Non-existent path
    expect(ensureDirectory(dirname('fixtures/ensuring-directory'))).toBe(true)
    // TODO(Lumirelle): Add test case for permission denied
  })

  it('should copy file correctly', () => {
    const result = copyFile(
      dirname('fixtures/butler.config.json'),
      dirname('fixtures/tmp/butler.config.json'),
    )
    expect(result).toBe(true)
    expect(exists(dirname('fixtures/tmp/butler.config.json'))).toBe(true)
  })

  it('should copy file and warn if file is exist', () => {
    const spied = spyOn(consola, 'warn')
    if (!exists(dirname('fixtures/tmp/butler.config.json'))) {
      const result = copyFile(
        dirname('fixtures/butler.config.json'),
        dirname('fixtures/tmp/butler.config.json'),
      )
      expect(result).toBe(true)
    }
    const result = copyFile(
      dirname('fixtures/butler.config.json'),
      dirname('fixtures/tmp/butler.config.json'),
    )
    expect(result).toBe(false)
    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith(
      `COPY: Path already exists: ${info(dirname('fixtures/tmp/butler.config.json'))}, skip`,
    )
    spied.mockClear()
  })

  it('should create backup when copying file with force', async () => {
    if (!exists(dirname('fixtures/tmp/butler.config.json'))) {
      const result = copyFile(
        dirname('fixtures/butler.config.json'),
        dirname('fixtures/tmp/butler.config.json'),
      )
      expect(result).toBe(true)
    }
    const spiedRenameSync = spyOn(fs, 'renameSync')
    const spiedCopyFileSync = spyOn(fs, 'copyFileSync').mockImplementationOnce(() => {
      throw new Error('Throw an error to test rollback')
    })
    await mock.module('node:fs', () => ({
      ...fs,
      renameSync: spiedRenameSync,
      copyFileSync: spiedCopyFileSync,
    }))
    try {
      copyFile(
        dirname('fixtures/butler.config.json'),
        dirname('fixtures/tmp/butler.config.json'),
        true,
      )
    }
    catch {
      /* Do nothing */
    }
    expect(spiedRenameSync).toHaveBeenCalledTimes(2)
    expect(exists(dirname('fixtures/tmp/butler.config.json'))).toBe(true)
    spiedRenameSync.mockClear()
  })

  it('should create symlink correctly', () => {
    createSymlink(
      dirname('fixtures/tmp/butler.config.json'),
      dirname('fixtures/tmp/symlink-to-config'),
    )
    expect(exists(dirname('fixtures/tmp/symlink-to-config'))).toBe(true)
  })

  it('should create symlink and warn if symlink is exist', () => {
    const spy = spyOn(consola, 'warn')
    if (!exists(dirname('fixtures/tmp/symlink-to-config'))) {
      const result = createSymlink(
        dirname('fixtures/tmp/butler.config.json'),
        dirname('fixtures/tmp/symlink-to-config'),
      )
      expect(result).toBe(true)
    }
    const result = createSymlink(
      dirname('fixtures/tmp/butler.config.json'),
      dirname('fixtures/tmp/symlink-to-config'),
    )
    expect(result).toBe(false)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      `LINK: Path already exists: ${info(dirname('fixtures/tmp/symlink-to-config'))}, skip`,
    )
    spy.mockClear()
  })

  it('should create backup when creating symlink with force', async () => {
    if (!exists(dirname('fixtures/tmp/symlink-to-config'))) {
      const result = createSymlink(
        dirname('fixtures/tmp/butler.config.json'),
        dirname('fixtures/tmp/symlink-to-config'),
      )
      expect(result).toBe(true)
    }
    const spiedRenameSync = spyOn(fs, 'renameSync')
    const spiedSymlinkSync = spyOn(fs, 'symlinkSync').mockImplementationOnce(() => {
      throw new Error('Throw an error to test rollback')
    })
    await mock.module('node:fs', () => ({
      ...fs,
      renameSync: spiedRenameSync,
      symlinkSync: spiedSymlinkSync,
    }))
    try {
      createSymlink(
        dirname('fixtures/tmp/butler.config.json'),
        dirname('fixtures/tmp/symlink-to-config'),
        true,
      )
    }
    catch {
      /* Do nothing */
    }
    expect(spiedRenameSync).toHaveBeenCalledTimes(2)
    expect(exists(dirname('fixtures/tmp/symlink-to-config'))).toBe(true)
    spiedRenameSync.mockClear()
  })

  it('should remove file or directory correctly', () => {
    // File
    copyFile(
      dirname('fixtures/butler.config.json'),
      dirname('fixtures/tmp/butler.config.json.to.delete'),
    )
    const result1 = remove(dirname('fixtures/tmp/butler.config.json.to.delete'))
    expect(result1).toBe(true)
    expect(exists(dirname('fixtures/tmp/butler.config.json.to.delete'))).toBe(false)
    // Folder
    ensureDirectory(dirname('fixtures/tmp/directory-to-delete/'))
    const result2 = remove(dirname('fixtures/tmp/directory-to-delete'), true)
    expect(result2).toBe(true)
    expect(exists(dirname('fixtures/tmp/directory-to-delete'))).toBe(false)
  })

  it('should warn when remove path which is not exist', () => {
    const spied = spyOn(consola, 'warn')
    const result = remove(dirname('fixtures/tmp/non-existent-path'))
    expect(result).toBe(false)
    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith(
      `REMOVE: Path not exists: ${info(dirname('fixtures/tmp/non-existent-path'))}, skip`,
    )
    spied.mockClear()
  })

  it('should remove symlink correctly', () => {
    createSymlink(
      dirname('fixtures/butler.config.json'),
      dirname('fixtures/tmp/symlink-to-config-to-delete'),
    )
    const result = removeSymlink(dirname('fixtures/tmp/symlink-to-config-to-delete'))
    expect(result).toBe(true)
    expect(exists(dirname('fixtures/tmp/symlink-to-config-to-delete'))).toBe(false)
  })

  it('should warn when remove path which is not symlink', () => {
    const spied = spyOn(consola, 'warn')
    const result = removeSymlink(dirname('fixtures/butler.config.json'))
    expect(result).toBe(false)
    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith(
      `REMOVE: Path is not a symlink: ${info(dirname('fixtures/butler.config.json'))}, skip`,
    )
    expect(exists(dirname('fixtures/butler.config.json'))).toBe(true)
    spied.mockClear()
  })
})
