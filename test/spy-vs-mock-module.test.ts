/**
 * @fileoverview A test file to compare the behavior of spying on module members and mocking the whole module.
 * @summary The simplest way is to use spy instead of mocking the whole module. If you still want to mock modules, you have to store a copy of the original implementation before you do the mocking, then re-mock it with this copy to restore to the original one, and the limitation is: it can only works synchronously.
 * @see https://github.com/oven-sh/bun/issues/7823
 * @author Lumirelle
 */

import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test'

/**
 * Use `import * as ...` for better compatibility with mocking modules, rr you will get in trouble with the different behavior between mocking ESM named exports, ESM default exports and CommonJS exports.
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

type Vite = typeof originalVite
type Eslint = typeof originalEslint

/**
 * Utilities for creating, mocking, calling, testing spies.
 */
class SpyUtils {
  private spiedViteNormalizePath: ReturnType<typeof spyOn<Vite, 'normalizePath'>>
  private spiedEslintLoad: ReturnType<typeof spyOn<Eslint, 'loadESLint'>>

  private constructor() {
    // Create spies on module members, at that time, the implementation is still the original one
    // That's why restore can restore to the original implementation
    this.spiedViteNormalizePath = spyOn(vite, 'normalizePath')
    this.spiedEslintLoad = spyOn(eslint, 'loadESLint')
  }

  public static spyOnModule(): SpyUtils {
    return new SpyUtils()
  }

  public mockImplementation(times: 'once' | 'always'): void {
    if (times === 'once') {
      this.spiedViteNormalizePath.mockImplementationOnce((_: string) => 'Mocked')
      this.spiedEslintLoad.mockImplementationOnce(async () => undefined as any)
    }
    else if (times === 'always') {
      this.spiedViteNormalizePath.mockImplementation((_: string) => 'Mocked')
      this.spiedEslintLoad.mockImplementation(async () => undefined as any)
    }
  }

  public mockClear(): void {
    this.spiedViteNormalizePath.mockClear()
    this.spiedEslintLoad.mockClear()
  }

  public mockRestore(): void {
    this.spiedViteNormalizePath.mockRestore()
    this.spiedEslintLoad.mockRestore()
  }

  public async call(): Promise<void> {
    this.spiedViteNormalizePath.call(vite, '/path/to/file/../file')
    await this.spiedEslintLoad.call(eslint)
  }

  public expectBeenCalledTimes(times: number): void {
    expect(this.spiedViteNormalizePath).toHaveBeenCalledTimes(times)
    expect(this.spiedEslintLoad).toHaveBeenCalledTimes(times)
  }

  public async expectOriginalImpl(): Promise<void> {
    expect(this.spiedViteNormalizePath.call(vite, '/path/to/file/../file')).toBe('/path/to/file')
    expect(await this.spiedEslintLoad.call(eslint)).toBeDefined()
  }

  public async expectMockedImpl(): Promise<void> {
    expect(this.spiedViteNormalizePath.call(vite, '/path/to/file/../file')).toBe('Mocked')
    expect(await this.spiedEslintLoad.call(eslint)).toBeUndefined()
  }

  public async expectNoImpl(): Promise<void> {
    expect(this.spiedViteNormalizePath.call(vite, '/path/to/file/../file')).toBeUndefined()
    expect(await this.spiedEslintLoad.call(eslint)).toBeUndefined()
  }
}

/**
 * Utilities for creating, mocking, calling, testing mocks.
 */
class MockUtils {
  private mockedViteNormalizePath: ReturnType<typeof mock<Vite['normalizePath']>>
  private mockedEslintLoad: ReturnType<typeof mock<Eslint['loadESLint']>>

  private constructor() {
    // Create mocks of module members, we should manually set the implementation to original one
    // If we need the ability to restore to original implementation
    this.mockedViteNormalizePath = mock(vite.normalizePath)
    this.mockedEslintLoad = mock(eslint.loadESLint)
    // Mock the modules with these mocks
    mock.module('vite', () => ({
      ...originalVite,
      normalizePath: this.mockedViteNormalizePath,
    }))
    mock.module('eslint', () => ({
      ...originalEslint,
      loadESLint: this.mockedEslintLoad,
    }))
  }

  public static mockModule(): MockUtils {
    return new MockUtils()
  }

  public static mockModuleOriginal(): void {
    mock.module('vite', () => ({
      ...originalVite,
    }))
    mock.module('eslint', () => ({
      ...originalEslint,
    }))
  }

  public mockImplementation(times: 'once' | 'always'): void {
    if (times === 'once') {
      this.mockedViteNormalizePath.mockImplementationOnce((_: string) => 'Mocked')
      this.mockedEslintLoad.mockImplementationOnce(async () => undefined as any)
    }
    else if (times === 'always') {
      this.mockedViteNormalizePath.mockImplementation((_: string) => 'Mocked')
      this.mockedEslintLoad.mockImplementation(async () => undefined as any)
    }
  }

  public mockClear(): void {
    this.mockedViteNormalizePath.mockClear()
    this.mockedEslintLoad.mockClear()
  }

  public mockRestore(): void {
    this.mockedViteNormalizePath.mockRestore()
    this.mockedEslintLoad.mockRestore()
  }

  public mockRestoreWithModuleOriginal(): void {
    this.mockRestore()
    MockUtils.mockModuleOriginal()
  }

  public async call(): Promise<void> {
    this.mockedViteNormalizePath.call(vite, '/path/to/file/../file')
    await this.mockedEslintLoad.call(eslint)
  }

  public expectBeenCalledTimes(times: number): void {
    expect(this.mockedViteNormalizePath).toHaveBeenCalledTimes(times)
    expect(this.mockedEslintLoad).toHaveBeenCalledTimes(times)
  }

  public async expectOriginalImpl(): Promise<void> {
    expect(this.mockedViteNormalizePath.call(vite, '/path/to/file/../file')).toBe('/path/to/file')
    expect(await this.mockedEslintLoad.call(eslint)).toBeDefined()
  }

  public async expectMockedImpl(): Promise<void> {
    expect(this.mockedViteNormalizePath.call(vite, '/path/to/file/../file')).toBe('Mocked')
    expect(await this.mockedEslintLoad.call(eslint)).toBeUndefined()
  }

  public async expectNoImpl(): Promise<void> {
    expect(this.mockedViteNormalizePath.call(vite, '/path/to/file/../file')).toBeUndefined()
    expect(await this.mockedEslintLoad.call(eslint)).toBeUndefined()
  }
}

/**
 * Utilities for testing module implementations.
 */
class ModuleUtils {
  static async expectOriginalImpl(): Promise<void> {
    expect((await import ('vite')).normalizePath('/path/to/file/../file')).toBe('/path/to/file')
    expect(await (await import('eslint')).loadESLint()).toBeDefined()
  }

  static async expectMockedImpl(): Promise<void> {
    expect((await import ('vite')).normalizePath('/path/to/file/../file')).toBe('Mocked')
    expect(await (await import('eslint')).loadESLint()).toBeUndefined()
  }

  static async expectNoImpl(): Promise<void> {
    expect((await import ('vite')).normalizePath('/path/to/file/../file')).toBeUndefined()
    expect(await (await import('eslint')).loadESLint()).toBeUndefined()
  }
}

describe('spy-vs-mock-module', () => {
  describe('module by default', async () => {
    it('should be original implementation', async () => {
      await ModuleUtils.expectOriginalImpl()
    })
  })

  describe('spy on module', async () => {
    afterEach(() => {
      mock.restore()
    })

    it('should mock implementation on module once', async () => {
      const spies = SpyUtils.spyOnModule()
      // Mock once
      spies.mockImplementation('once')
      await ModuleUtils.expectMockedImpl()
      // Next call will use original implementation
      await ModuleUtils.expectOriginalImpl()
    })

    it('should mock implementation on module always', async () => {
      const spies = SpyUtils.spyOnModule()
      // Mock always
      spies.mockImplementation('always')
      await ModuleUtils.expectMockedImpl()
      // Next call still uses mocked implementation
      await ModuleUtils.expectMockedImpl()
    })

    it('can clear called history by `spied.mockClear()`', async () => {
      const spies = SpyUtils.spyOnModule()

      // Call
      spies.mockImplementation('always')
      spies.expectBeenCalledTimes(0)
      await spies.call()
      spies.expectBeenCalledTimes(1)

      // Clear called history, and call again
      spies.mockClear()
      spies.expectBeenCalledTimes(0)
      await spies.call()
      spies.expectBeenCalledTimes(1)
    })

    it('can clear called history by `spied.mockClear()` without affecting implementation on module', async () => {
      const spies = SpyUtils.spyOnModule()

      // Call
      spies.mockImplementation('always')
      spies.expectBeenCalledTimes(0)
      await spies.expectMockedImpl()
      spies.expectBeenCalledTimes(1)

      // Clear called history, and call again
      spies.mockClear()
      spies.expectBeenCalledTimes(0)
      await spies.expectMockedImpl()
      spies.expectBeenCalledTimes(1)
    })

    it('can clear called history by global `mock.clearAllMocks()`', async () => {
      const spies = SpyUtils.spyOnModule()

      // Call
      spies.mockImplementation('always')
      spies.expectBeenCalledTimes(0)
      await spies.call()
      spies.expectBeenCalledTimes(1)

      // Clear called history, and call again
      mock.clearAllMocks()
      spies.expectBeenCalledTimes(0)
      await spies.call()
      spies.expectBeenCalledTimes(1)
    })

    it('can clear called history by global `mock.clearAllMocks()` without affecting implementation on module', async () => {
      const spies = SpyUtils.spyOnModule()

      // Call
      spies.mockImplementation('always')
      spies.expectBeenCalledTimes(0)
      await spies.expectMockedImpl()
      spies.expectBeenCalledTimes(1)

      // Clear called history, and call again
      mock.clearAllMocks()
      spies.expectBeenCalledTimes(0)
      await spies.expectMockedImpl()
      spies.expectBeenCalledTimes(1)
    })

    it('should restore `spyOn` module by `spied.mockRestore()`', async () => {
      const spies = SpyUtils.spyOnModule()

      // When `spyOn`, calls on module are recorded
      spies.expectBeenCalledTimes(0)
      await ModuleUtils.expectOriginalImpl()
      spies.expectBeenCalledTimes(1)

      // After restore `spyOn`, calls on module are not recorded
      spies.mockRestore()
      spies.expectBeenCalledTimes(0)
      await ModuleUtils.expectOriginalImpl()
      spies.expectBeenCalledTimes(0)
    })

    it('should restore `spyOn` module by global `mock.restore()`', async () => {
      const spies = SpyUtils.spyOnModule()

      // When `spyOn`, calls on module are recorded
      spies.expectBeenCalledTimes(0)
      await ModuleUtils.expectOriginalImpl()
      spies.expectBeenCalledTimes(1)

      // After restore `spyOn`, calls on module are not recorded
      mock.restore()
      spies.expectBeenCalledTimes(0)
      await ModuleUtils.expectOriginalImpl()
      spies.expectBeenCalledTimes(0)
    })

    it('should restore to previous mocked implementation by `spied.mockRestore()', async () => {
      const spies = SpyUtils.spyOnModule()

      spies.mockImplementation('always')
      spies.expectBeenCalledTimes(0)
      await spies.expectMockedImpl()
      spies.expectBeenCalledTimes(1)

      // Restore to previous mocked implementation
      spies.mockRestore()
      spies.expectBeenCalledTimes(0)
      await spies.expectNoImpl()
      spies.expectBeenCalledTimes(1)
    })

    it('should restore to previous mocked implementation by global `mock.restore()`', async () => {
      const spies = SpyUtils.spyOnModule()

      spies.mockImplementation('always')
      spies.expectBeenCalledTimes(0)
      await spies.expectMockedImpl()
      spies.expectBeenCalledTimes(1)

      // Restore to previous mocked implementation
      mock.restore()
      spies.expectBeenCalledTimes(0)
      await spies.expectNoImpl()
      spies.expectBeenCalledTimes(1)
    })
  })

  describe('mock on module', async () => {
    afterEach(() => {
      MockUtils.mockModuleOriginal()
    })

    it('should mock implementation on module once', async () => {
      const mocks = MockUtils.mockModule()
      // Mock once
      mocks.mockImplementation('once')
      await ModuleUtils.expectMockedImpl()
      // Next call will use original implementation
      await ModuleUtils.expectOriginalImpl()
    })

    it('should mock implementation on module always', async () => {
      const mocks = MockUtils.mockModule()
      // Mock always
      mocks.mockImplementation('always')
      await ModuleUtils.expectMockedImpl()
      // Next call still uses mocked implementation
      await ModuleUtils.expectMockedImpl()
    })

    it('can clear called history by `mocked.mockClear()`', async () => {
      const mocks = MockUtils.mockModule()

      mocks.mockImplementation('always')
      mocks.expectBeenCalledTimes(0)
      await mocks.call()
      mocks.expectBeenCalledTimes(1)

      // Clear called history
      mocks.mockClear()
      mocks.expectBeenCalledTimes(0)
      await mocks.call()
      mocks.expectBeenCalledTimes(1)
    })

    it('can clear called history by `mocked.mockClear()` without affecting implementation on module', async () => {
      const mocks = MockUtils.mockModule()

      mocks.mockImplementation('always')
      mocks.expectBeenCalledTimes(0)
      await ModuleUtils.expectMockedImpl()
      mocks.expectBeenCalledTimes(1)

      // Clear called history
      mocks.mockClear()
      mocks.expectBeenCalledTimes(0)
      await ModuleUtils.expectMockedImpl()
      mocks.expectBeenCalledTimes(1)
    })

    it('should clear called history by global `mock.clearAllMocks()`', async () => {
      const mocks = MockUtils.mockModule()

      mocks.mockImplementation('always')
      mocks.expectBeenCalledTimes(0)
      await mocks.call()
      mocks.expectBeenCalledTimes(1)

      // Clear called history
      mock.clearAllMocks()
      mocks.expectBeenCalledTimes(0)
      await mocks.call()
      mocks.expectBeenCalledTimes(1)
    })

    it('should clear called history by global `mock.clearAllMocks()` without affecting implementation on module', async () => {
      const mocks = MockUtils.mockModule()

      mocks.mockImplementation('always')
      mocks.expectBeenCalledTimes(0)
      await ModuleUtils.expectMockedImpl()
      mocks.expectBeenCalledTimes(1)

      // Clear called history
      mock.clearAllMocks()
      mocks.expectBeenCalledTimes(0)
      await ModuleUtils.expectMockedImpl()
      mocks.expectBeenCalledTimes(1)
    })

    it.failing('should fail to restore `mock module` by `mocked.mockRestore()`', async () => {
      const mocks = MockUtils.mockModule()

      // When `mock module`, calls on module are recorded
      mocks.expectBeenCalledTimes(0)
      await ModuleUtils.expectOriginalImpl()
      mocks.expectBeenCalledTimes(1)

      // After restore `mock module`, calls on module are still recorded
      mocks.mockRestore()
      mocks.expectBeenCalledTimes(0)
      await ModuleUtils.expectOriginalImpl()
      mocks.expectBeenCalledTimes(0)
    })

    it.failing('should fail to restore `mock module` by global `mock.restore()`', async () => {
      const mocks = MockUtils.mockModule()

      // When `mock module`, calls on module are recorded
      mocks.expectBeenCalledTimes(0)
      await ModuleUtils.expectOriginalImpl()
      mocks.expectBeenCalledTimes(1)

      // After restore `mock module`, calls on module are still recorded
      mock.restore()
      mocks.expectBeenCalledTimes(0)
      await ModuleUtils.expectOriginalImpl()
      mocks.expectBeenCalledTimes(0)
    })

    it('should restore `mock module` by re-mocking module with original implementation', async () => {
      const mocks = MockUtils.mockModule()

      // When `mock module`, calls on module are recorded
      mocks.expectBeenCalledTimes(0)
      await ModuleUtils.expectOriginalImpl()
      mocks.expectBeenCalledTimes(1)

      // After restore `mock module`, calls on module are still recorded
      mocks.mockRestoreWithModuleOriginal()
      mocks.expectBeenCalledTimes(0)
      await ModuleUtils.expectOriginalImpl()
      mocks.expectBeenCalledTimes(0)
    })

    it('should restore to previous mocked implementation by `mocked.mockRestore()`', async () => {
      const mocks = MockUtils.mockModule()

      mocks.mockImplementation('always')
      mocks.expectBeenCalledTimes(0)
      await mocks.expectMockedImpl()
      mocks.expectBeenCalledTimes(1)

      // Restore to previous mocked implementation
      mocks.mockRestore()
      mocks.expectBeenCalledTimes(0)
      await mocks.expectNoImpl()
      mocks.expectBeenCalledTimes(1)
    })

    it.todo('should restore to previous mocked implementation by global `mock.restore()`', async () => {
      const mocks = MockUtils.mockModule()

      mocks.mockImplementation('always')
      mocks.expectBeenCalledTimes(0)
      await mocks.expectMockedImpl()
      mocks.expectBeenCalledTimes(1)

      // Restore to previous mocked implementation
      mock.restore()
      mocks.expectBeenCalledTimes(0)
      await mocks.expectNoImpl()
      mocks.expectBeenCalledTimes(1)
    })
  })
})
