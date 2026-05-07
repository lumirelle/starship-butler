import { afterAll, beforeAll, describe, expect, it, spyOn } from 'bun:test'
import process from 'node:process'
import { filterActions } from '../../../src/command/preset/actions'

describe('actions', () => {
  describe('filterActions()', () => {
    describe('general', () => {
      it('should include only "nushell" action', async () => {
        const filteredActions = await filterActions({
          include: ['nushell'],
        })
        // Extract only `id` and `name` for comparison
        const simpleFilteredActions = filteredActions.map(item => ({
          id: item.id,
          name: item.name,
        }))
        expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "nushell",
          "name": "Nushell",
        },
      ]
    `)
      })
      it('should prompt user to select actions when include option is empty', async () => {
        const clackPrompts = await import('@clack/prompts')
        const spy = spyOn(clackPrompts, 'multiselect').mockImplementation(async () => ['nushell', 'bash'] as any)

        const filteredActions = await filterActions({
          include: [],
        })
        expect(spy).toHaveBeenCalledTimes(1)
        expect(filteredActions.map(action => action.id)).toEqual(['nushell', 'bash'])

        spy.mockRestore()
      })
    })

    describe('win32', () => {
      let originalPlatform: NodeJS.Platform
      beforeAll(() => {
        originalPlatform = process.platform
        Object.defineProperty(process, 'platform', {
          value: 'win32',
        })
      })
      afterAll(() => {
        Object.defineProperty(process, 'platform', {
          value: originalPlatform,
        })
      })

      it('should include all actions with include option set to ".*"', async () => {
        const filteredActions = await filterActions({
          include: ['.*'],
        })
        const simpleFilteredActions = filteredActions.map(item => ({
          id: item.id,
          name: item.name,
        }))
        expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "clash-verge-rev",
          "name": "Clash Verge Rev",
        },
        {
          "id": "rime",
          "name": "rime",
        },
        {
          "id": "windows-terminal",
          "name": "Windows Terminal",
        },
        {
          "id": "nushell",
          "name": "Nushell",
        },
        {
          "id": "bash",
          "name": "Bash",
        },
        {
          "id": "powershell",
          "name": "PowerShell",
        },
        {
          "id": "windows-powershell",
          "name": "Windows PowerShell",
        },
        {
          "id": "starship",
          "name": "Starship",
        },
        {
          "id": "git",
          "name": "Git",
        },
        {
          "id": "maven",
          "name": "Maven",
        },
        {
          "id": "@sxzz/create",
          "name": "@sxzz/create",
        },
        {
          "id": "vscode",
          "name": "VSCode",
        },
        {
          "id": "cursor",
          "name": "Cursor",
        },
        {
          "id": "zed",
          "name": "Zed",
        },
        {
          "id": "nvim",
          "name": "Neo Vim",
        },
        {
          "id": "cspell",
          "name": "cSpell",
        },
      ]
    `)
      })
      it('should include all actions with "all" option set to true', async () => {
        const filteredActions = await filterActions({
          all: true,
        })
        const simpleFilteredActions = filteredActions.map(item => ({
          id: item.id,
          name: item.name,
        }))
        expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "clash-verge-rev",
          "name": "Clash Verge Rev",
        },
        {
          "id": "rime",
          "name": "rime",
        },
        {
          "id": "windows-terminal",
          "name": "Windows Terminal",
        },
        {
          "id": "nushell",
          "name": "Nushell",
        },
        {
          "id": "bash",
          "name": "Bash",
        },
        {
          "id": "powershell",
          "name": "PowerShell",
        },
        {
          "id": "windows-powershell",
          "name": "Windows PowerShell",
        },
        {
          "id": "starship",
          "name": "Starship",
        },
        {
          "id": "git",
          "name": "Git",
        },
        {
          "id": "maven",
          "name": "Maven",
        },
        {
          "id": "@sxzz/create",
          "name": "@sxzz/create",
        },
        {
          "id": "vscode",
          "name": "VSCode",
        },
        {
          "id": "cursor",
          "name": "Cursor",
        },
        {
          "id": "zed",
          "name": "Zed",
        },
        {
          "id": "nvim",
          "name": "Neo Vim",
        },
        {
          "id": "cspell",
          "name": "cSpell",
        },
      ]
    `)
      })
      it('should exclude "nushell" action with include option set to ".*" and exclude option set to "nushell"', async () => {
        const filteredActions = await filterActions({
          include: ['.*'],
          exclude: ['nushell'],
        })
        const simpleFilteredActions = filteredActions.map(item => ({
          id: item.id,
          name: item.name,
        }))
        expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "clash-verge-rev",
          "name": "Clash Verge Rev",
        },
        {
          "id": "rime",
          "name": "rime",
        },
        {
          "id": "windows-terminal",
          "name": "Windows Terminal",
        },
        {
          "id": "bash",
          "name": "Bash",
        },
        {
          "id": "powershell",
          "name": "PowerShell",
        },
        {
          "id": "windows-powershell",
          "name": "Windows PowerShell",
        },
        {
          "id": "starship",
          "name": "Starship",
        },
        {
          "id": "git",
          "name": "Git",
        },
        {
          "id": "maven",
          "name": "Maven",
        },
        {
          "id": "@sxzz/create",
          "name": "@sxzz/create",
        },
        {
          "id": "vscode",
          "name": "VSCode",
        },
        {
          "id": "cursor",
          "name": "Cursor",
        },
        {
          "id": "zed",
          "name": "Zed",
        },
        {
          "id": "nvim",
          "name": "Neo Vim",
        },
        {
          "id": "cspell",
          "name": "cSpell",
        },
      ]
    `)
      })
    })

    describe('linux', () => {
      let originalPlatform: NodeJS.Platform
      beforeAll(() => {
        originalPlatform = process.platform
        Object.defineProperty(process, 'platform', {
          value: 'linux',
        })
      })
      afterAll(() => {
        Object.defineProperty(process, 'platform', {
          value: originalPlatform,
        })
      })

      it('should include all actions with include option set to ".*"', async () => {
        const filteredActions = await filterActions({
          include: ['.*'],
        })
        const simpleFilteredActions = filteredActions.map(item => ({
          id: item.id,
          name: item.name,
        }))
        expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "clash-verge-rev",
          "name": "Clash Verge Rev",
        },
        {
          "id": "rime",
          "name": "rime",
        },
        {
          "id": "windows-terminal",
          "name": "Windows Terminal",
        },
        {
          "id": "nushell",
          "name": "Nushell",
        },
        {
          "id": "bash",
          "name": "Bash",
        },
        {
          "id": "powershell",
          "name": "PowerShell",
        },
        {
          "id": "windows-powershell",
          "name": "Windows PowerShell",
        },
        {
          "id": "starship",
          "name": "Starship",
        },
        {
          "id": "git",
          "name": "Git",
        },
        {
          "id": "maven",
          "name": "Maven",
        },
        {
          "id": "@sxzz/create",
          "name": "@sxzz/create",
        },
        {
          "id": "vscode",
          "name": "VSCode",
        },
        {
          "id": "cursor",
          "name": "Cursor",
        },
        {
          "id": "zed",
          "name": "Zed",
        },
        {
          "id": "nvim",
          "name": "Neo Vim",
        },
        {
          "id": "cspell",
          "name": "cSpell",
        },
      ]
    `)
      })
      it('should include all actions with "all" option set to true', async () => {
        const filteredActions = await filterActions({
          all: true,
        })
        const simpleFilteredActions = filteredActions.map(item => ({
          id: item.id,
          name: item.name,
        }))
        expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "clash-verge-rev",
          "name": "Clash Verge Rev",
        },
        {
          "id": "rime",
          "name": "rime",
        },
        {
          "id": "windows-terminal",
          "name": "Windows Terminal",
        },
        {
          "id": "nushell",
          "name": "Nushell",
        },
        {
          "id": "bash",
          "name": "Bash",
        },
        {
          "id": "powershell",
          "name": "PowerShell",
        },
        {
          "id": "windows-powershell",
          "name": "Windows PowerShell",
        },
        {
          "id": "starship",
          "name": "Starship",
        },
        {
          "id": "git",
          "name": "Git",
        },
        {
          "id": "maven",
          "name": "Maven",
        },
        {
          "id": "@sxzz/create",
          "name": "@sxzz/create",
        },
        {
          "id": "vscode",
          "name": "VSCode",
        },
        {
          "id": "cursor",
          "name": "Cursor",
        },
        {
          "id": "zed",
          "name": "Zed",
        },
        {
          "id": "nvim",
          "name": "Neo Vim",
        },
        {
          "id": "cspell",
          "name": "cSpell",
        },
      ]
    `)
      })
      it('should exclude "nushell" action with include option set to ".*" and exclude option set to "nushell"', async () => {
        const filteredActions = await filterActions({
          include: ['.*'],
          exclude: ['nushell'],
        })
        const simpleFilteredActions = filteredActions.map(item => ({
          id: item.id,
          name: item.name,
        }))
        expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "clash-verge-rev",
          "name": "Clash Verge Rev",
        },
        {
          "id": "rime",
          "name": "rime",
        },
        {
          "id": "windows-terminal",
          "name": "Windows Terminal",
        },
        {
          "id": "bash",
          "name": "Bash",
        },
        {
          "id": "powershell",
          "name": "PowerShell",
        },
        {
          "id": "windows-powershell",
          "name": "Windows PowerShell",
        },
        {
          "id": "starship",
          "name": "Starship",
        },
        {
          "id": "git",
          "name": "Git",
        },
        {
          "id": "maven",
          "name": "Maven",
        },
        {
          "id": "@sxzz/create",
          "name": "@sxzz/create",
        },
        {
          "id": "vscode",
          "name": "VSCode",
        },
        {
          "id": "cursor",
          "name": "Cursor",
        },
        {
          "id": "zed",
          "name": "Zed",
        },
        {
          "id": "nvim",
          "name": "Neo Vim",
        },
        {
          "id": "cspell",
          "name": "cSpell",
        },
      ]
    `)
      })
    })

    describe('mac os', () => {
      let originalPlatform: NodeJS.Platform
      beforeAll(() => {
        originalPlatform = process.platform
        Object.defineProperty(process, 'platform', {
          value: 'darwin',
        })
      })
      afterAll(() => {
        Object.defineProperty(process, 'platform', {
          value: originalPlatform,
        })
      })

      it('should include all actions with include option set to ".*"', async () => {
        const filteredActions = await filterActions({
          include: ['.*'],
        })
        const simpleFilteredActions = filteredActions.map(item => ({
          id: item.id,
          name: item.name,
        }))
        expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "clash-verge-rev",
          "name": "Clash Verge Rev",
        },
        {
          "id": "rime",
          "name": "rime",
        },
        {
          "id": "windows-terminal",
          "name": "Windows Terminal",
        },
        {
          "id": "nushell",
          "name": "Nushell",
        },
        {
          "id": "bash",
          "name": "Bash",
        },
        {
          "id": "powershell",
          "name": "PowerShell",
        },
        {
          "id": "windows-powershell",
          "name": "Windows PowerShell",
        },
        {
          "id": "starship",
          "name": "Starship",
        },
        {
          "id": "git",
          "name": "Git",
        },
        {
          "id": "maven",
          "name": "Maven",
        },
        {
          "id": "@sxzz/create",
          "name": "@sxzz/create",
        },
        {
          "id": "vscode",
          "name": "VSCode",
        },
        {
          "id": "cursor",
          "name": "Cursor",
        },
        {
          "id": "zed",
          "name": "Zed",
        },
        {
          "id": "nvim",
          "name": "Neo Vim",
        },
        {
          "id": "cspell",
          "name": "cSpell",
        },
      ]
    `)
      })
      it('should include all actions with "all" option set to true', async () => {
        const filteredActions = await filterActions({
          all: true,
        })
        const simpleFilteredActions = filteredActions.map(item => ({
          id: item.id,
          name: item.name,
        }))
        expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "clash-verge-rev",
          "name": "Clash Verge Rev",
        },
        {
          "id": "rime",
          "name": "rime",
        },
        {
          "id": "windows-terminal",
          "name": "Windows Terminal",
        },
        {
          "id": "nushell",
          "name": "Nushell",
        },
        {
          "id": "bash",
          "name": "Bash",
        },
        {
          "id": "powershell",
          "name": "PowerShell",
        },
        {
          "id": "windows-powershell",
          "name": "Windows PowerShell",
        },
        {
          "id": "starship",
          "name": "Starship",
        },
        {
          "id": "git",
          "name": "Git",
        },
        {
          "id": "maven",
          "name": "Maven",
        },
        {
          "id": "@sxzz/create",
          "name": "@sxzz/create",
        },
        {
          "id": "vscode",
          "name": "VSCode",
        },
        {
          "id": "cursor",
          "name": "Cursor",
        },
        {
          "id": "zed",
          "name": "Zed",
        },
        {
          "id": "nvim",
          "name": "Neo Vim",
        },
        {
          "id": "cspell",
          "name": "cSpell",
        },
      ]
    `)
      })
      it('should exclude "nushell" action with include option set to ".*" and exclude option set to "nushell"', async () => {
        const filteredActions = await filterActions({
          include: ['.*'],
          exclude: ['nushell'],
        })
        const simpleFilteredActions = filteredActions.map(item => ({
          id: item.id,
          name: item.name,
        }))
        expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "clash-verge-rev",
          "name": "Clash Verge Rev",
        },
        {
          "id": "rime",
          "name": "rime",
        },
        {
          "id": "windows-terminal",
          "name": "Windows Terminal",
        },
        {
          "id": "bash",
          "name": "Bash",
        },
        {
          "id": "powershell",
          "name": "PowerShell",
        },
        {
          "id": "windows-powershell",
          "name": "Windows PowerShell",
        },
        {
          "id": "starship",
          "name": "Starship",
        },
        {
          "id": "git",
          "name": "Git",
        },
        {
          "id": "maven",
          "name": "Maven",
        },
        {
          "id": "@sxzz/create",
          "name": "@sxzz/create",
        },
        {
          "id": "vscode",
          "name": "VSCode",
        },
        {
          "id": "cursor",
          "name": "Cursor",
        },
        {
          "id": "zed",
          "name": "Zed",
        },
        {
          "id": "nvim",
          "name": "Neo Vim",
        },
        {
          "id": "cspell",
          "name": "cSpell",
        },
      ]
    `)
      })
    })
  })
})
