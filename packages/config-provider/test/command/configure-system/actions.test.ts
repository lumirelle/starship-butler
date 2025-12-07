import { describe, expect, it } from 'bun:test'
import { filterActions } from '../../../src/command/configure-system/actions'
import { PRESET_ACTIONS } from '../../../src/command/configure-system/preset'

describe('actions', () => {
  it('should include only "nushell" action', async () => {
    const filteredActions = filterActions(PRESET_ACTIONS, {
      includeOnly: ['nushell'],
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
          "name": "setting up Nushell",
        },
      ]
    `)
  })
  it('should exclude "nushell" action', async () => {
    const filteredActions = filterActions(PRESET_ACTIONS, {
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
          "name": "setting up Clash Verge Rev",
        },
        {
          "id": "windows-terminal",
          "name": "setting up Windows Terminal",
        },
        {
          "id": "bash",
          "name": "setting up Bash",
        },
        {
          "id": "powershell",
          "name": "setting up PowerShell",
        },
        {
          "id": "windows-powershell",
          "name": "setting up Windows PowerShell",
        },
        {
          "id": "starship",
          "name": "setting up Starship",
        },
        {
          "id": "git",
          "name": "setting up Git",
        },
        {
          "id": "bun",
          "name": "setting up Bun",
        },
        {
          "id": "bun-global-install",
          "name": "setting up Bun Global Config",
        },
        {
          "id": "maven",
          "name": "setting up Maven",
        },
        {
          "id": "@sxzz/create",
          "name": "setting up @sxzz/create",
        },
        {
          "id": "czg",
          "name": "setting up czg",
        },
        {
          "id": "vscode",
          "name": "setting up VSCode",
        },
        {
          "id": "cursor",
          "name": "setting up Cursor",
        },
        {
          "id": "zed",
          "name": "setting up Zed",
        },
        {
          "id": "nvim",
          "name": "setting up Neo Vim",
        },
        {
          "id": "cspell",
          "name": "setting up cSpell",
        },
      ]
    `)
  })
})
