import { describe, expect, it } from 'bun:test'
import { homedir as _homedir, platform } from 'node:os'
import { appdata, homedir, localAppdata } from '../src/path'

describe('action utils', () => {
  it('homedir should work', () => {
    const path = homedir('.config', 'test')
    expect(path).toBe(`${_homedir().replace(/\\/g, '/')}/.config/test`)
  })

  it.if(platform() === 'win32')('appdata should work', () => {
    const path = appdata('test', 'appdata')
    expect(path).toBe(`${process.env.APPDATA?.replace(/\\/g, '/')}/test/appdata`)
  })

  it.if(platform() === 'win32')('localAppdata should work', () => {
    const path = localAppdata('test', 'localappdata')
    expect(path).toBe(`${process.env.LOCALAPPDATA?.replace(/\\/g, '/')}/test/localappdata`)
  })
})
