import { describe, expect, it } from 'bun:test'
import { filterActions } from '../../../src/command/preset/actions'

describe('actions', () => {
  it('should include only "nushell" action', async () => {
    const filteredActions = await filterActions({
      include: ['nushell'],
    })
    // Extract only `id` and `name` for comparison
    const simpleFilteredActions = filteredActions.map((item) => {
      return {
        id: item.id,
        name: item.name,
      }
    })
    expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "nushell",
          "name": "Nushell",
        },
      ]
    `)
  })
  it('should include all actions with include option set to ".*"', async () => {
    const filteredActions = await filterActions({
      include: ['.*'],
    })
    const simpleFilteredActions = filteredActions.map((item) => {
      return {
        id: item.id,
        name: item.name,
      }
    })
    expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "clash-verge-rev",
          "name": "Clash Verge Rev",
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
          "id": "bun",
          "name": "Bun",
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
    const simpleFilteredActions = filteredActions.map((item) => {
      return {
        id: item.id,
        name: item.name,
      }
    })
    expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "clash-verge-rev",
          "name": "Clash Verge Rev",
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
          "id": "bun",
          "name": "Bun",
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
    const simpleFilteredActions = filteredActions.map((item) => {
      return {
        id: item.id,
        name: item.name,
      }
    })
    expect(simpleFilteredActions).toMatchInlineSnapshot(`
      [
        {
          "id": "clash-verge-rev",
          "name": "Clash Verge Rev",
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
          "id": "bun",
          "name": "Bun",
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
