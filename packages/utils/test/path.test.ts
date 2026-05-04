import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { homedir as _homedir } from 'node:os'
import process from 'node:process'
import { isWindows } from 'std-env'
import { appdata, homedir, localAppdata } from '../src/path'

describe('path util', () => {
  describe('homedir()', () => {
    let originalXdgConfigHome: string | undefined
    beforeAll(() => {
      originalXdgConfigHome = process.env.XDG_CONFIG_HOME
    })
    afterEach(() => {
      process.env.XDG_CONFIG_HOME = originalXdgConfigHome
    })

    it('should return normalized home path', () => {
      process.env.XDG_CONFIG_HOME = undefined
      const path = homedir('.config', 'test')
      expect(path).toBe(
        `${process.env.XDG_CONFIG_HOME ?? _homedir().replaceAll('\\', '/')}/.config/test`,
      )
    })

    it('should return xdg config home path when set', () => {
      process.env.XDG_CONFIG_HOME = '/custom/config/home'
      const path = homedir('.config', 'test')
      expect(path).toBe('/custom/config/home/.config/test')
    })
  })

  describe.if(isWindows)('appdata()', () => {
    it('should return the normalized appdata path', () => {
      const path = appdata('test', 'appdata')
      expect(path).toBe(`${process.env.APPDATA?.replaceAll('\\', '/')}/test/appdata`)
    })
  })

  describe.if(isWindows)('localAppdata()', () => {
    it('should return the normalized local appdata path', () => {
      const path = localAppdata('test', 'localappdata')
      expect(path).toBe(`${process.env.LOCALAPPDATA?.replaceAll('\\', '/')}/test/localappdata`)
    })
  })
})
