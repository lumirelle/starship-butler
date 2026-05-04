import { afterAll, beforeAll, describe, expect, it, spyOn } from 'bun:test'
import { consola } from 'consola'
import { relative as _relative, normalize } from 'pathe'
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

// Helpers
/** Dirname of the current file */
const dirname = normalize(import.meta.dirname)
/** Returns the absolute path for a given relative path, based on the dirname */
function absoluteDirname(path: string): string {
  return `${dirname}/${path}`
}
/** Transforms a path relative from dirname to process.cwd() */
function relativeDirname2Cwd(path: string): string {
  return _relative(process.cwd(), absoluteDirname(path)) + (path.endsWith('/') ? '/' : '')
}

beforeAll(() => {
  ensureDirectory(absoluteDirname('fixtures/tmp/'))
})
afterAll(() => {
  remove(absoluteDirname('fixtures/tmp/'), true)
})

describe('fs util', () => {
  describe('absoluteDirname()', () => {
    it('should return absolute path based on dirname', () => {
      expect(absoluteDirname('fixtures')).toBe(`${dirname}/fixtures`)
      expect(absoluteDirname('fixtures/butler.config.json')).toBe(`${dirname}/fixtures/butler.config.json`)
    })
  })

  describe('relativeDirname2Cwd()', () => {
    it('should transform path relative from dirname to process.cwd()', () => {
      expect(relativeDirname2Cwd('fixtures/butler.config.json')).toBe('packages/utils/test/fixtures/butler.config.json')
      expect(relativeDirname2Cwd('fixtures')).toBe('packages/utils/test/fixtures')
    })

    it('should return normalized path', () => {
      expect(relativeDirname2Cwd('..\\test\\fixtures\\butler.config.json')).toBe('packages/utils/test/fixtures/butler.config.json')
      expect(relativeDirname2Cwd('..\\test\\fixtures')).toBe('packages/utils/test/fixtures')
    })

    it('should preserve trailing slash', () => {
      expect(relativeDirname2Cwd('fixtures/butler.config.json/')).toBe('packages/utils/test/fixtures/butler.config.json/')
      expect(relativeDirname2Cwd('fixtures/')).toBe('packages/utils/test/fixtures/')
    })
  })

  describe('exists()', () => {
    beforeAll(() => {
      createSymlink(absoluteDirname('fixtures/butler.config.json'), absoluteDirname('fixtures/symlink-to-config'))
    })
    afterAll(() => {
      remove(absoluteDirname('fixtures/symlink-to-config'))
    })

    it('should return true for existing directories', () => {
      expect(exists(relativeDirname2Cwd('fixtures'))).toBe(true)
      expect(exists(absoluteDirname('fixtures'))).toBe(true)
    })

    it('should return true for existing files', () => {
      expect(exists(relativeDirname2Cwd('fixtures/butler.config.json'))).toBe(true)
      expect(exists(absoluteDirname('fixtures/butler.config.json'))).toBe(true)
    })

    it('should return true for existing symlinks', () => {
      expect(exists(relativeDirname2Cwd('fixtures/symlink-to-config'))).toBe(true)
      expect(exists(absoluteDirname('fixtures/symlink-to-config'))).toBe(true)
    })

    it('should return false for non-existing directories', () => {
      expect(exists(relativeDirname2Cwd('non-existing-folder'))).toBe(false)
      expect(exists(absoluteDirname('non-existing-folder'))).toBe(false)
    })

    it('should return false for non-existing files', () => {
      expect(exists(relativeDirname2Cwd('fixtures/non-existing-file.txt'))).toBe(false)
      expect(exists(absoluteDirname('fixtures/non-existing-file.txt'))).toBe(false)
    })

    it('should return false for non-existing symlinks', () => {
      expect(exists(relativeDirname2Cwd('fixtures/non-existing-symlink'))).toBe(false)
      expect(exists(absoluteDirname('fixtures/non-existing-symlink'))).toBe(false)
    })

    // Directory tolerates trailing slash, but file & symlink do not,
    // so we treat the input path with trailing slash as a directory path,
    // which only matches directories
    it('should return true only for existing directories with trailing slash', () => {
      // Existing directories without trailing slash
      expect(exists(relativeDirname2Cwd('fixtures'))).toBe(true)
      expect(exists(absoluteDirname('fixtures'))).toBe(true)
      // Existing directory with trailing slash
      expect(exists(relativeDirname2Cwd('fixtures/'))).toBe(true)
      expect(exists(absoluteDirname('fixtures/'))).toBe(true)

      // Existing files & symlinks without trailing slash
      expect(exists(absoluteDirname('fixtures/butler.config.json'))).toBe(true)
      expect(exists(relativeDirname2Cwd('fixtures/butler.config.json'))).toBe(true)
      expect(exists(absoluteDirname('fixtures/symlink-to-config'))).toBe(true)
      expect(exists(relativeDirname2Cwd('fixtures/symlink-to-config'))).toBe(true)
      // Existing files & symlinks with trailing slash, will be treated as non-existing!!!
      expect(exists(absoluteDirname('fixtures/butler.config.json/'))).toBe(false)
      expect(exists(relativeDirname2Cwd('fixtures/butler.config.json/'))).toBe(false)
      expect(exists(absoluteDirname('fixtures/symlink-to-config/'))).toBe(false)
      expect(exists(relativeDirname2Cwd('fixtures/symlink-to-config/'))).toBe(false)
    })
  })

  describe('isDirectory()', () => {
    it('should return true for existing directories', () => {
      expect(isDirectory(relativeDirname2Cwd('fixtures'))).toBe(true)
      expect(isDirectory(absoluteDirname('fixtures'))).toBe(true)
    })

    it('should return false for existing files', () => {
      expect(isDirectory(relativeDirname2Cwd('fixtures/butler.config.json'))).toBe(false)
      expect(isDirectory(absoluteDirname('fixtures/butler.config.json'))).toBe(false)
    })

    it('should return false for existing symlinks', () => {
      expect(isDirectory(relativeDirname2Cwd('fixtures/symlink-to-config'))).toBe(false)
      expect(isDirectory(absoluteDirname('fixtures/symlink-to-config'))).toBe(false)
    })

    it('should always return true for paths with trailing slash', () => {
      // Existing directories
      expect(isDirectory(relativeDirname2Cwd('fixtures/'))).toBe(true)
      expect(isDirectory(absoluteDirname('fixtures/'))).toBe(true)
      // Non-existing directories
      expect(isDirectory(relativeDirname2Cwd('none-existing-directory/'))).toBe(true)
      expect(isDirectory(absoluteDirname('none-existing-directory/'))).toBe(true)

      // File & symlins with trailing slash exists, will be treated as non-existing directories!!!
      expect(isDirectory(relativeDirname2Cwd('fixtures/butler.config.json/'))).toBe(true)
      expect(isDirectory(absoluteDirname('fixtures/butler.config.json/'))).toBe(true)
      expect(isDirectory(relativeDirname2Cwd('fixtures/symlink-to-config/'))).toBe(true)
      expect(isDirectory(absoluteDirname('fixtures/symlink-to-config/'))).toBe(true)
    })
  })

  describe('isSymbolicLink()', () => {
    beforeAll(() => {
      createSymlink(absoluteDirname('fixtures/butler.config.json'), absoluteDirname('fixtures/symlink-to-config'))
    })
    afterAll(() => {
      remove(absoluteDirname('fixtures/symlink-to-config'))
    })

    it('should return false for existing directories', () => {
      expect(isSymbolicLink(relativeDirname2Cwd('fixtures'))).toBe(false)
      expect(isSymbolicLink(absoluteDirname('fixtures'))).toBe(false)
    })

    it('should return false for existing files', () => {
      expect(isSymbolicLink(relativeDirname2Cwd('fixtures/butler.config.json'))).toBe(false)
      expect(isSymbolicLink(absoluteDirname('fixtures/butler.config.json'))).toBe(false)
    })

    it('should return true for existing symlinks', () => {
      expect(isSymbolicLink(relativeDirname2Cwd('fixtures/symlink-to-config'))).toBe(true)
      expect(isSymbolicLink(absoluteDirname('fixtures/symlink-to-config'))).toBe(true)
    })

    it('should return false for non-existing paths', () => {
      // Non existing paths without trailing slash
      expect(isSymbolicLink(relativeDirname2Cwd('fixtures/non-existing-path'))).toBe(false)
      expect(isSymbolicLink(absoluteDirname('fixtures/non-existing-path'))).toBe(false)
      // Non existing paths with trailing slash
      expect(isSymbolicLink(relativeDirname2Cwd('non-existing-path/'))).toBe(false)
      expect(isSymbolicLink(absoluteDirname('non-existing-path/'))).toBe(false)
      // Files & symlinks with trailing slash will be treated as non-existing paths!!!
      expect(isSymbolicLink(relativeDirname2Cwd('fixtures/symlink-to-config/'))).toBe(false)
      expect(isSymbolicLink(absoluteDirname('fixtures/symlink-to-config/'))).toBe(false)
    })
  })

  describe('ensureDirectory()', () => {
    beforeAll(() => {
      createSymlink(absoluteDirname('fixtures/butler.config.json'), absoluteDirname('fixtures/symlink-to-config'))
    })
    afterAll(() => {
      remove(absoluteDirname('fixtures/symlink-to-config'))
    })

    it('should return true for existing directories', () => {
      expect(ensureDirectory(relativeDirname2Cwd('fixtures/'))).toBe(true)
      expect(ensureDirectory(absoluteDirname('fixtures/'))).toBe(true)
    })

    it('should return false for existing files & symlinks', () => {
      expect(ensureDirectory(relativeDirname2Cwd('fixtures/butler.config.json'))).toBe(false)
      expect(ensureDirectory(absoluteDirname('fixtures/butler.config.json'))).toBe(false)
      expect(ensureDirectory(relativeDirname2Cwd('fixtures/symlink-to-config'))).toBe(false)
      expect(ensureDirectory(absoluteDirname('fixtures/symlink-to-config'))).toBe(false)
    })

    it('should create directory if not exist and return true when successful', () => {
      expect(exists(absoluteDirname('fixtures/ensuring-directory'))).toBe(false)
      expect(ensureDirectory(absoluteDirname('fixtures/ensuring-directory'))).toBe(true)
      expect(exists(absoluteDirname('fixtures/ensuring-directory'))).toBe(true)
      remove(absoluteDirname('fixtures/ensuring-directory'), true)

      expect(exists(relativeDirname2Cwd('fixtures/ensuring-directory'))).toBe(false)
      expect(ensureDirectory(relativeDirname2Cwd('fixtures/ensuring-directory'))).toBe(true)
      expect(exists(relativeDirname2Cwd('fixtures/ensuring-directory'))).toBe(true)
      remove(relativeDirname2Cwd('fixtures/ensuring-directory'), true)
    })
  })

  describe('copyFile()', () => {
    it('should copy file', () => {
      expect(copyFile(
        absoluteDirname('fixtures/butler.config.json'),
        absoluteDirname('fixtures/tmp/butler.config.json'),
      )).toBe(true)
      expect(exists(absoluteDirname('fixtures/tmp/butler.config.json'))).toBe(true)
      remove(absoluteDirname('fixtures/tmp/butler.config.json'))
    })

    it('should warn if file is exist', () => {
      const spy = spyOn(consola, 'warn')

      expect(copyFile(
        absoluteDirname('fixtures/butler.config.json'),
        absoluteDirname('fixtures/tmp/butler.config.json'),
      )).toBe(true)

      expect(copyFile(
        absoluteDirname('fixtures/butler.config.json'),
        absoluteDirname('fixtures/tmp/butler.config.json'),
      )).toBe(false)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        `COPY: Path already exists: ${info(absoluteDirname('fixtures/tmp/butler.config.json'))}, skip`,
      )

      remove(absoluteDirname('fixtures/tmp/butler.config.json'))
      spy.mockRestore()
    })

    it('should create backup when force', async () => {
      expect(copyFile(
        absoluteDirname('fixtures/butler.config.json'),
        absoluteDirname('fixtures/tmp/butler.config.json'),
      )).toBe(true)

      const fs = await import('node:fs')
      const spiedRenameSync = spyOn(fs, 'renameSync')
      const spiedCopyFileSync = spyOn(fs, 'copyFileSync').mockImplementationOnce(() => {
        throw new Error('Throw an error to test rollback')
      })
      try {
        copyFile(
          absoluteDirname('fixtures/butler.config.json'),
          absoluteDirname('fixtures/tmp/butler.config.json'),
          true,
        )
      }
      catch {
        /* Do nothing */
      }
      expect(spiedRenameSync).toHaveBeenCalledTimes(2)
      expect(spiedRenameSync.mock.calls).toEqual([
        [absoluteDirname('fixtures/tmp/butler.config.json'), absoluteDirname('fixtures/tmp/butler.config.json.bak')],
        [absoluteDirname('fixtures/tmp/butler.config.json.bak'), absoluteDirname('fixtures/tmp/butler.config.json')],
      ])
      expect(exists(absoluteDirname('fixtures/tmp/butler.config.json'))).toBe(true)

      remove(absoluteDirname('fixtures/tmp/butler.config.json'))
      spiedRenameSync.mockRestore()
      spiedCopyFileSync.mockRestore()
    })
  })

  describe('createSymlink()', () => {
    it('should create symlink correctly', () => {
      createSymlink(
        absoluteDirname('fixtures/tmp/butler.config.json'),
        absoluteDirname('fixtures/tmp/symlink-to-config'),
      )
      expect(exists(absoluteDirname('fixtures/tmp/symlink-to-config'))).toBe(true)
      expect(isSymbolicLink(absoluteDirname('fixtures/tmp/symlink-to-config'))).toBe(true)
      remove(absoluteDirname('fixtures/tmp/symlink-to-config'))
    })

    it('should warn if symlink is exist', () => {
      const spy = spyOn(consola, 'warn')

      expect(createSymlink(
        absoluteDirname('fixtures/tmp/butler.config.json'),
        absoluteDirname('fixtures/tmp/symlink-to-config'),
      )).toBe(true)

      expect(createSymlink(
        absoluteDirname('fixtures/tmp/butler.config.json'),
        absoluteDirname('fixtures/tmp/symlink-to-config'),
      )).toBe(false)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        `LINK: Path already exists: ${info(absoluteDirname('fixtures/tmp/symlink-to-config'))}, skip`,
      )

      remove(absoluteDirname('fixtures/tmp/symlink-to-config'))
      spy.mockRestore()
    })

    it('should create backup when force', async () => {
      expect(createSymlink(
        absoluteDirname('fixtures/tmp/butler.config.json'),
        absoluteDirname('fixtures/tmp/symlink-to-config'),
      )).toBe(true)

      const fs = await import('node:fs')
      const spiedRenameSync = spyOn(fs, 'renameSync')
      const spiedSymlinkSync = spyOn(fs, 'symlinkSync').mockImplementationOnce(() => {
        throw new Error('Throw an error to test rollback')
      })
      try {
        createSymlink(
          absoluteDirname('fixtures/tmp/butler.config.json'),
          absoluteDirname('fixtures/tmp/symlink-to-config'),
          true,
        )
      }
      catch {
        /* Do nothing */
      }
      expect(spiedRenameSync).toHaveBeenCalledTimes(2)
      expect(spiedRenameSync.mock.calls).toEqual([
        [absoluteDirname('fixtures/tmp/symlink-to-config'), absoluteDirname('fixtures/tmp/symlink-to-config.bak')],
        [absoluteDirname('fixtures/tmp/symlink-to-config.bak'), absoluteDirname('fixtures/tmp/symlink-to-config')],
      ])
      expect(exists(absoluteDirname('fixtures/tmp/symlink-to-config'))).toBe(true)
      expect(isSymbolicLink(absoluteDirname('fixtures/tmp/symlink-to-config'))).toBe(true)

      remove(absoluteDirname('fixtures/tmp/symlink-to-config'))
      spiedRenameSync.mockRestore()
      spiedSymlinkSync.mockRestore()
    })
  })

  describe('remove()', () => {
    it('should remove directory', () => {
      ensureDirectory(absoluteDirname('fixtures/tmp/directory-to-delete/'))
      expect(remove(absoluteDirname('fixtures/tmp/directory-to-delete'), true)).toBe(true)
      expect(exists(absoluteDirname('fixtures/tmp/directory-to-delete'))).toBe(false)
    })

    it('should remove file', () => {
      // File
      copyFile(
        absoluteDirname('fixtures/butler.config.json'),
        absoluteDirname('fixtures/tmp/butler.config.json.to.delete'),
      )
      expect(remove(absoluteDirname('fixtures/tmp/butler.config.json.to.delete'))).toBe(true)
      expect(exists(absoluteDirname('fixtures/tmp/butler.config.json.to.delete'))).toBe(false)
    })

    it('should warn if remove path is not exist', () => {
      const spied = spyOn(consola, 'warn')
      const result = remove(absoluteDirname('fixtures/tmp/non-existing-path'))
      expect(result).toBe(false)
      expect(spied).toHaveBeenCalledTimes(1)
      expect(spied).toHaveBeenCalledWith(
        `REMOVE: Path not exists: ${info(absoluteDirname('fixtures/tmp/non-existing-path'))}, skip`,
      )
      spied.mockRestore()
    })
  })

  describe('removeSymlink()', () => {
    it('should remove symlink correctly', () => {
      createSymlink(
        absoluteDirname('fixtures/butler.config.json'),
        absoluteDirname('fixtures/tmp/symlink-to-config-to-delete'),
      )
      expect(isSymbolicLink(absoluteDirname('fixtures/tmp/symlink-to-config-to-delete'))).toBe(true)
      expect(removeSymlink(absoluteDirname('fixtures/tmp/symlink-to-config-to-delete'))).toBe(true)
      expect(exists(absoluteDirname('fixtures/tmp/symlink-to-config-to-delete'))).toBe(false)
    })

    it('should warn if remove path is not symlink', () => {
      const spy = spyOn(consola, 'warn')
      expect(removeSymlink(absoluteDirname('fixtures/butler.config.json'))).toBe(false)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        `REMOVE: Path is not a symlink: ${info(absoluteDirname('fixtures/butler.config.json'))}, skip`,
      )
      expect(exists(absoluteDirname('fixtures/butler.config.json'))).toBe(true)
      spy.mockRestore()
    })
  })
})
