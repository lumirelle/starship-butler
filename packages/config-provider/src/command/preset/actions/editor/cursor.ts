import type { Action, ConfigPathGenerator, PlatformTargetFolderMap } from '../../types'
import consola from 'consola'
import { join } from 'pathe'
import { appdata, ensureDirectoryExist, homedir, isPathExist, processConfig } from '../utils'

const name = 'Cursor'

const platformTargetFolderMap: PlatformTargetFolderMap = {
  win32: appdata('Cursor', 'User'),
  linux: homedir('.config', 'Cursor', 'User'),
  darwin: homedir('Library', 'Application Support', 'Cursor', 'User'),
}

const configPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('editor', 'vscode', 'default', 'keybindings.json'),
    target: join(targetFolder, 'keybindings.json'),
  }),
  (targetFolder: string) => ({
    source: join('editor', 'vscode', 'default', 'settings.json'),
    target: join(targetFolder, 'settings.json'),
  }),
  () => {
    // TODO: Better condition check?
    const mcpFolder = homedir('.cursor')
    ensureDirectoryExist(mcpFolder)
    return {
      source: join('editor', 'cursor', 'mcp.json'),
      target: join(mcpFolder, 'mcp.json'),
    }
  },
  (targetFolder: string) => ({
    source: join('editor', 'vscode', 'default', 'global.code-snippets'),
    target: join(targetFolder, 'snippets', 'global.code-snippets'),
  }),
  (targetFolder: string) => ({
    source: join('editor', 'vscode', 'default', 'comment.code-snippets'),
    target: join(targetFolder, 'snippets', 'comment.code-snippets'),
  }),
]

export function cursor(): Action {
  return {
    id: 'cursor',
    name: 'Cursor',
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      return platformTargetFolderMap[platform] ?? ''
    },
    prehandler: ({ targetFolder }) => {
      // TODO: Is this check correct?
      if (!isPathExist(targetFolder, `You should install ${name} first!`))
        return false
      return true
    },
    handler: async ({ options, targetFolder }) => {
      for (const generator of configPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
    posthandler: () => {
      consola.info('This configuration is meant to be used by `Cursor` in user scope.')
    },
  }
}

const mcpName = 'Cursor MCP'

const mcpTargetFolder = homedir('.cursor')

const mcpConfigPathGenerators: ConfigPathGenerator[] = [
  (targetFolder: string) => ({
    source: join('editor', 'cursor', 'mcp.json'),
    target: join(targetFolder, 'mcp.json'),
  }),
]

export function cursorMcp(): Action {
  return {
    id: 'cursor-mcp',
    name: mcpName,
    targetFolder: mcpTargetFolder,
    prehandler: ({ targetFolder, systemOptions }) => {
      // TODO: Is this check correct?
      if (!platformTargetFolderMap[systemOptions.platform]) {
        consola.error(`Unsupported platform: ${systemOptions.platform}`)
        return false
      }
      if (!isPathExist(platformTargetFolderMap[systemOptions.platform]!, `You should install ${name} first!`))
        return false
      if (!ensureDirectoryExist(targetFolder))
        return false
      return true
    },
    handler: async ({ options, targetFolder }) => {
      for (const generator of mcpConfigPathGenerators) {
        const { source, target } = generator(targetFolder)
        await processConfig(source, target, options)
      }
    },
    posthandler: () => {
      consola.info('This configuration is for Cursor MCP servers.')
    },
  }
}
