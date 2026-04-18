import { describe, expect, it, mock } from 'bun:test'
import process from 'node:process'
import { filterActions } from '../../../src/command/preset/actions'

describe('actions', () => {
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

  // Win 32
  it.if(process.platform === 'win32')('should include all actions with include option set to ".*"', async () => {
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
  it.if(process.platform === 'win32')('should include all actions with "all" option set to true', async () => {
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
  it.if(process.platform === 'win32')('should exclude "nushell" action with include option set to ".*" and exclude option set to "nushell"', async () => {
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

  // Linux
  it.if(process.platform === 'linux')('should include all actions with include option set to ".*"', async () => {
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
  it.if(process.platform === 'linux')('should include all actions with "all" option set to true', async () => {
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
  it.if(process.platform === 'linux')('should exclude "nushell" action with include option set to ".*" and exclude option set to "nushell"', async () => {
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
          "id": "bash",
          "name": "Bash",
        },
        {
          "id": "powershell",
          "name": "PowerShell",
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

  // MacOS
  it.if(process.platform === 'darwin')('should include all actions with include option set to ".*"', async () => {
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
  it.if(process.platform === 'darwin')('should include all actions with "all" option set to true', async () => {
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
  it.if(process.platform === 'darwin')('should exclude "nushell" action with include option set to ".*" and exclude option set to "nushell"', async () => {
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
          "id": "bash",
          "name": "Bash",
        },
        {
          "id": "powershell",
          "name": "PowerShell",
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

  it('should prompt user to select actions when include option is empty', async () => {
    const mockedMultiselect = mock(() => ['nushell', 'bash'])
    await mock.module('@clack/prompts', () => ({
      multiselect: mockedMultiselect,
    }))
    const filteredActions = await filterActions({
      include: [],
    })
    expect(mockedMultiselect).toHaveBeenCalledTimes(1)
    expect(filteredActions.map(action => action.id)).toEqual(['nushell', 'bash'])
  })
})
