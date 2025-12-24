/**
 * @fileoverview Tests for restore mocked module to original implementations, or just use spy.
 * @summary The simplest way is to use spy instead of mocking the whole module, if you still want to mock modules, you have to store a copy of the original implementation before you do the mocking, then re-mock it with this copy to restore.
 * @author Lumirelle
 */

import { describe, expect, it, mock, spyOn } from 'bun:test'

/**
 * Use `import * as ...` for better compatibility with mocking modules.
 *
 * Or you will get in trouble with the different between ESM named exports, ESM default exports and CommonJS exports.
 */
import * as eslint from 'eslint'
import * as vite from 'vite'

/**
 * You can use a copy to store the original implementation of a module before mocking. When you want to restore the original implementation, you can simply re-mock the module with this copy.
 *
 * For this reason, YOU SHOULD NOT MOCK AND SPY ON THIS COPY IN ANY CASE.
 *
 * If you are mocking the deeper members of a module, just use a deep copy instead.
 */
const originalVite = { ...vite }
const originalEslint = { ...eslint }

describe('restore mocked modules or spy', () => {
  it('should use original implementation by default', async () => {
    const path = vite.normalizePath('C:\\path\\to\\file')
    expect(path).toBe('C:/path/to/file')

    const eslintInstance = await eslint.loadESLint()
    expect(eslintInstance).toBeDefined()
  })

  // TODO(Lumirelle): Should mock members, clear mock and restore mock correctly?

  it('should spy on members, clear spy (history) and restore spy correctly', async () => {
    const spiedViteNormalizePath = spyOn(vite, 'normalizePath')
    const spiedEslintLoad = spyOn(eslint, 'loadESLint')

    // Mock implementation once
    spiedViteNormalizePath.mockImplementationOnce((_: string) => 'Mocked')
    spiedEslintLoad.mockImplementationOnce(async () => undefined as any)
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('Mocked')
    expect(await eslint.loadESLint()).toBeUndefined()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(1)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(1)

    // Next call will use original implementation, but called times still increases
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('C:/path/to/file')
    expect(await eslint.loadESLint()).toBeDefined()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(2)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(2)

    // Mock implementation permanently, called times do not reset
    spiedViteNormalizePath.mockImplementation((_: string) => 'Mocked')
    spiedEslintLoad.mockImplementation(async () => undefined as any)
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('Mocked')
    expect(await eslint.loadESLint()).toBeUndefined()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(3)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(3)

    // Next call still uses mocked implementation, called times increases
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('Mocked')
    expect(await eslint.loadESLint()).toBeUndefined()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(4)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(4)

    // `mockClear()` only resets called times
    spiedViteNormalizePath.mockClear()
    spiedEslintLoad.mockClear()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(0)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(0)
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('Mocked')
    expect(await eslint.loadESLint()).toBeUndefined()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(1)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(1)

    // `mockRestore()` reset both implementation and called times
    spiedViteNormalizePath.mockRestore()
    spiedEslintLoad.mockRestore()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(0)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(0)
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('C:/path/to/file')
    expect(await eslint.loadESLint()).toBeDefined()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(0)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(0)
  })

  it('cannot restore directly mocked module to original implementation by `mock.restore()`, but re-mock', async () => {
    // Mock member `normalizePath` of module `vite` directly
    mock.module('vite', () => ({
      ...vite,
      normalizePath: (_: string) => 'Mocked',
    }))
    // Mock member `default.loadESLint` of module `eslint` directly
    mock.module('eslint', () => ({
      ...eslint,
      loadESLint: async () => undefined as any,
    }))

    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('Mocked')
    expect(await eslint.loadESLint()).toBeUndefined()

    // Next call still uses mocked implementation
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('Mocked')
    expect(await eslint.loadESLint()).toBeUndefined()
    // Restore does not work, next call still uses mocked implementation
    mock.restore()
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('Mocked')
    expect(await eslint.loadESLint()).toBeUndefined()

    // The only way to restore original implementation in this case is re-mock the module
    // Don't forget to use the copy of original implementation, to avoid being affected by the next time mocking
    mock.module('vite', () => ({ ...originalVite }))
    mock.module('eslint', () => ({ ...originalEslint }))
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('C:/path/to/file')
    expect(await eslint.loadESLint()).toBeDefined()
  })

  it('cannot restore mocked module with mocked members to original implementation by `mock.restore()`, but re-mock', async () => {
    const mockedViteNormalizePath = mock((_: string) => 'Mocked')
    const mockedEslintLoad = mock(async () => undefined as any)

    // Mock module `vite` with mocked member `normalizePath`
    mock.module('vite', () => ({
      ...vite,
      normalizePath: mockedViteNormalizePath,
    }))
    // Mock module `eslint` with mocked member `default.loadESLint`
    mock.module('eslint', () => ({
      ...eslint,
      loadESLint: mockedEslintLoad,
    }))
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('Mocked')
    expect(await eslint.loadESLint()).toBeUndefined()
    expect(mockedViteNormalizePath).toHaveBeenCalledTimes(1)
    expect(mockedEslintLoad).toHaveBeenCalledTimes(1)

    // Next call still uses mocked implementation
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('Mocked')
    expect(await eslint.loadESLint()).toBeUndefined()
    expect(mockedViteNormalizePath).toHaveBeenCalledTimes(2)
    expect(mockedEslintLoad).toHaveBeenCalledTimes(2)

    // Restore does not work, next call still uses mocked implementation
    mock.restore()
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('Mocked')
    expect(await eslint.loadESLint()).toBeUndefined()
    expect(mockedViteNormalizePath).toHaveBeenCalledTimes(3)
    expect(mockedEslintLoad).toHaveBeenCalledTimes(3)

    // Only `mocked.mockRestore()` works here, but it will restore mocked implementation to `undefined`, not the original one
    mockedViteNormalizePath.mockRestore()
    mockedEslintLoad.mockRestore()
    expect(mockedViteNormalizePath).toHaveBeenCalledTimes(0)
    expect(mockedEslintLoad).toHaveBeenCalledTimes(0)
    expect(vite.normalizePath('C:\\path\\to\\file')).toBeUndefined()
    expect(await eslint.loadESLint()).toBeUndefined()
    expect(mockedViteNormalizePath).toHaveBeenCalledTimes(1)
    expect(mockedEslintLoad).toHaveBeenCalledTimes(1)

    // The only way to recover original implementations in this case is re-mock the module
    mock.module('vite', () => ({ ...originalVite }))
    mock.module('eslint', () => ({ ...originalEslint }))
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('C:/path/to/file')
    expect(await eslint.loadESLint()).toBeDefined()
    expect(mockedViteNormalizePath).toHaveBeenCalledTimes(1)
    expect(mockedEslintLoad).toHaveBeenCalledTimes(1)
  })

  it('cannot totally restore mocked module with spied members to original implementation by both `mock.restore()`, but re-mock', async () => {
    const spiedViteNormalizePath = spyOn(vite, 'normalizePath')
    const spiedEslintLoad = spyOn(eslint, 'loadESLint')

    // Mock module `vite` with spied member `normalizePath`
    spiedViteNormalizePath.mockImplementation((_: string) => 'Mocked')
    // Mock module `eslint` with spied member `default.loadESLint`
    spiedEslintLoad.mockImplementation(async () => undefined as any)
    mock.module('vite', () => ({
      ...vite,
      normalizePath: spiedViteNormalizePath,
    }))
    mock.module('eslint', () => ({
      ...eslint,
      loadESLint: spiedEslintLoad,
    }))
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('Mocked')
    expect(await eslint.loadESLint()).toBeUndefined()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(1)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(1)

    // Next call still uses mocked implementation
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('Mocked')
    expect(await eslint.loadESLint()).toBeUndefined()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(2)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(2)

    // Restore works well, next call will use original implementation
    mock.restore()
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('C:/path/to/file')
    expect(await eslint.loadESLint()).toBeDefined()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(0)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(0)

    spiedViteNormalizePath.mockImplementation((_: string) => 'Mocked Again')
    spiedEslintLoad.mockImplementation(async () => undefined as any)
    // The same as above, `mockRestore()` work well
    spiedViteNormalizePath.mockRestore()
    spiedEslintLoad.mockRestore()
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('C:/path/to/file')
    expect(await eslint.loadESLint()).toBeDefined()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(0)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(0)

    // Re-mock the module also works
    mock.module('vite', () => ({ ...originalVite }))
    mock.module('eslint', () => ({ ...originalEslint }))
    expect(vite.normalizePath('C:\\path\\to\\file')).toBe('C:/path/to/file')
    expect(await eslint.loadESLint()).toBeDefined()
    expect(spiedViteNormalizePath).toHaveBeenCalledTimes(0)
    expect(spiedEslintLoad).toHaveBeenCalledTimes(0)
  })
})
