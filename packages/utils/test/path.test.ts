import { homedir as _homedir } from 'node:os'
import process from 'node:process'
import { isWindows } from 'std-env'
import { describe, expect, it, vi } from 'vitest'
import { appdata, homedir, localAppdata } from '../src/path'

describe('path util', () => {
  describe('homedir()', () => {
    it('should return normalized home path', () => {
      vi.stubEnv('XDG_CONFIG_HOME', undefined)
      const path = homedir('.config', 'test')
      expect(path).toBe(
        `${process.env.XDG_CONFIG_HOME ?? _homedir().replaceAll('\\', '/')}/.config/test`,
      )
    })

    it('should return xdg config home path when set', () => {
      vi.stubEnv('XDG_CONFIG_HOME', '/custom/config/home')
      const path = homedir('.config', 'test')
      expect(path).toBe('/custom/config/home/.config/test')
    })
  })

  describe.skipIf(!isWindows)('appdata()', () => {
    it('should return the normalized appdata path', () => {
      const path = appdata('test', 'appdata')
      expect(path).toBe(`${process.env.APPDATA?.replaceAll('\\', '/')}/test/appdata`)
    })
  })

  describe.skipIf(!isWindows)('localAppdata()', () => {
    it('should return the normalized local appdata path', () => {
      const path = localAppdata('test', 'localappdata')
      expect(path).toBe(`${process.env.LOCALAPPDATA?.replaceAll('\\', '/')}/test/localappdata`)
    })
  })
})
