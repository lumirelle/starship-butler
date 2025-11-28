import type { Action, TargetMap } from './types'
import { homedir } from 'node:os'
import process from 'node:process'
import consola from 'consola'
import { join } from 'pathe'
import { processConfig } from '../../utils/config'
import { checkPlatformSupport, checkTargetExist, ensureTargetFolderExist } from './handler'

/**
 * Preset actions to configure your system.
 */
export const PRESET_ACTIONS: Action[] = [
  /* ------------------------------- 1. Network ------------------------------- */
  // Clash Verge Rev
  {
    id: 'clash-verge-rev',
    name: 'setting up Clash Verge Rev',
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      const applicationId = 'io.github.clash-verge-rev.clash-verge-rev'
      const targetMap: TargetMap = {
        win32: join(process.env.APPDATA!, applicationId, 'profiles'),
        linux: join(homedir(), '.local', 'shared', applicationId, 'profiles'),
        darwin: join(homedir(), 'Library', 'Application Support', applicationId, 'profiles'),
      }
      return targetMap[platform] ?? ''
    },
    prehandler: ({ systemOptions, targetFolder }) => {
      const { platform } = systemOptions
      if (!checkPlatformSupport(['win32', 'linux', 'darwin'], platform)) {
        return false
      }
      // TODO: Is this check correct?
      if (!checkTargetExist(targetFolder, 'You should install Clash Verge Rev first!')) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('network', 'clash-verge-rev', 'Script.js'), target: join(targetFolder, 'Script.js') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
  },
  /* ------------------------------ 2. Terminals ------------------------------ */
  // Windows Terminal
  {
    id: 'windows-terminal',
    name: 'setting up Windows Terminal',
    targetFolder: join(process.env.LOCALAPPDATA ?? '', 'Packages', 'Microsoft.WindowsTerminal_8wekyb3d8bbwe', 'LocalState'),
    prehandler: ({ systemOptions, targetFolder }) => {
      const { platform } = systemOptions
      if (!checkPlatformSupport(['win32'], platform)) {
        return false
      }
      // TODO: Is this check correct?
      if (!checkTargetExist(targetFolder, 'You should install Windows Terminal first!')) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('terminal', 'windows-terminal', 'settings.json'), target: join(targetFolder, 'settings.json') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
    posthandler: () => {
      consola.info('This configuration will use `"M Plus Code Latin 50", "Source Han Sans TC", "Symbols Nerd Font"` as terminal fonts.')
    },
  },
  /* -------------------------------- 3. Shells ------------------------------- */
  // Nushell
  {
    id: 'nushell',
    name: 'setting up Nushell',
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      const targetMap: TargetMap = {
        win32: join(process.env.APPDATA!, 'nushell'),
        linux: join(homedir(), '.config', 'nushell'),
        darwin: join(homedir(), 'Library', 'Application Support', 'nushell'),
      }
      return targetMap[platform] ?? ''
    },
    prehandler: ({ systemOptions, targetFolder }) => {
      const { platform } = systemOptions
      if (!checkPlatformSupport(['win32', 'linux', 'darwin'], platform)) {
        return false
      }
      // TODO: Is this check correct?
      if (!checkTargetExist(targetFolder, 'You should install Nushell first!')) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('shell', 'nu', 'utils.nu'), target: join(targetFolder, 'utils.nu') },
        { source: join('shell', 'nu', 'config.nu'), target: join(targetFolder, 'config.nu') },
        { source: join('shell', 'nu', 'env.nu'), target: join(targetFolder, 'env.nu') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
  },
  // Bash
  {
    id: 'bash',
    name: 'setting up Bash',
    targetFolder: homedir(),
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('shell', 'bash', '.bash_profile'), target: join(targetFolder, '.bash_profile') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
  },
  // CMD
  {
    id: 'cmd',
    name: 'setting up CMD',
    targetFolder: join(homedir(), 'Documents', 'CMD'),
    prehandler: ({ systemOptions, targetFolder }) => {
      const { platform } = systemOptions
      if (!checkPlatformSupport(['win32'], platform)) {
        return false
      }
      if (!ensureTargetFolderExist(targetFolder)) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('shell', 'cmd', 'autorun.cmd'), target: join(targetFolder, 'autorun.cmd') },
        { source: join('shell', 'cmd', 'autorun.reg'), target: join(targetFolder, 'autorun.reg') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
    posthandler: () => {
      consola.info('Please running the `.reg` file under `~/Documents/CMD` with Registry Editor to enable autorun feature.')
    },
  },
  // PowerShell
  {
    id: 'powershell',
    name: 'setting up PowerShell',
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      const targetMap: TargetMap = {
        win32: join(homedir(), 'Documents', 'PowerShell'),
        linux: join(homedir(), '.config', 'powershell'),
        darwin: join(homedir(), '.config', 'powershell'),
      }
      return targetMap[platform] ?? ''
    },
    prehandler: ({ systemOptions, targetFolder }) => {
      const { platform } = systemOptions
      if (!checkPlatformSupport(['win32', 'linux', 'darwin'], platform)) {
        return false
      }
      // For win32 platform, ensure target folder exist
      if (platform === 'win32' && !ensureTargetFolderExist(targetFolder)) {
        return false
      }
      // For other platform, just check if PowerShell is installed
      // TODO: Is this check correct?
      else if (
        platform !== 'win32'
        && !checkTargetExist(targetFolder, 'You should install PowerShell first!')
      ) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('shell', 'pwsh', 'profile.ps1'), target: join(targetFolder, 'profile.ps1') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
    posthandler: () => {
      consola.info('Please running `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` to allow local scripts to run.')
    },
  },
  // Windows PowerShell
  {
    id: 'windows-powershell',
    name: 'setting up Windows PowerShell',
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      const targetMap: TargetMap = {
        win32: join(homedir(), 'Documents', 'WindowsPowerShell'),
      }
      return targetMap[platform] ?? ''
    },
    prehandler: ({ systemOptions, targetFolder }) => {
      const { platform } = systemOptions
      if (!checkPlatformSupport(
        ['win32'],
        platform,
        'Windows PowerShell is the legacy version bundled in Windows, so we just support it in win32 platform.',
      )) {
        return false
      }
      // For win32 platform, ensure target folder exist
      if (platform === 'win32' && !ensureTargetFolderExist(targetFolder)) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('shell', 'pwsh', 'profile.ps1'), target: join(targetFolder, 'Microsoft.PowerShell_profile.ps1') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
    posthandler: () => {
      consola.info('Please running `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` to allow local scripts to run.')
    },
  },
  // Starship
  {
    id: 'starship',
    name: 'setting up Starship',
    targetFolder: join(homedir(), '.config'),
    prehandler: ({ targetFolder }) => {
      if (!ensureTargetFolderExist(targetFolder)) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('shell-prompt', 'starship', 'starship.toml'), target: join(targetFolder, 'starship.toml') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
    posthandler: () => {
      consola.info('Nerd Fonts is required to display all icons correctly in Starship prompt.')
    },
  },
  /* --------------------------------- 4. VCS --------------------------------- */
  // Git
  {
    id: 'git',
    name: 'setting up Git',
    targetFolder: homedir(),
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('vcs', 'git', '.gitconfig'), target: join(targetFolder, '.gitconfig') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
  },
  /* ------------------------- 5. PM (Package Manager) ------------------------ */
  // Maven
  {
    id: 'maven',
    name: 'setting up Maven',
    targetFolder: join(homedir(), '.m2'),
    prehandler: ({ targetFolder }) => {
      if (!ensureTargetFolderExist(targetFolder)) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('pm', 'maven', 'settings.xml'), target: join(targetFolder, 'settings.xml') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
  },
  /* -------------------------------- 6. Tools -------------------------------- */
  // @sxzz/create -- Creating projects
  {
    id: '@sxzz/create',
    name: 'setting up @sxzz/create',
    targetFolder: join(homedir(), '.config'),
    prehandler: ({ targetFolder }) => {
      if (!ensureTargetFolderExist(targetFolder)) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('tools', 'sxzz-create', 'create.config.yml'), target: join(targetFolder, 'create.config.yml') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
  },
  // simple-git-hooks -- Run with fnm environment
  {
    id: 'simple-git-hooks',
    name: 'setting up simple-git-hooks',
    targetFolder: homedir(),
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('tools', 'simple-git-hooks', '.simple-git-hooks.rc'), target: join(targetFolder, '.simple-git-hooks.rc') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
    posthandler: ({ systemOptions }) => {
      const { platform } = systemOptions
      const target = join(homedir(), '.simple-git-hooks.rc')
      consola.info('This configuration is aiming to run `simple-git-hooks` with `fnm` environment.')
      if (platform === 'win32') {
        consola.info(`Notice that, you should add \`SIMPLE_GIT_HOOKS_RC=${target}\` to your system environment variables to let this configuration take effect.`)
      }
      else {
        consola.info(`Notice that, you should add \`SIMPLE_GIT_HOOKS_RC=${target}\` to your system environment variables at \`/etc/environment\` to let this configuration take effect.`)
      }
    },
  },
  // czg -- Git commit message generating tool
  {
    id: 'czg',
    name: 'setting up czg',
    targetFolder: homedir(),
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('tools', 'czg', '.czrc'), target: join(targetFolder, '.czrc') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
  },
  /* ------------------------------- 7. Editors ------------------------------- */
  // VSCode
  {
    id: 'vscode',
    name: 'setting up VSCode',
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      const targetMap: TargetMap = {
        win32: join(process.env.APPDATA!, 'Code', 'User'),
        linux: join(homedir(), '.config', 'Code', 'User'),
        darwin: join(homedir(), 'Library', 'Application Support', 'Code', 'User'),
      }
      return targetMap[platform] ?? ''
    },
    prehandler: ({ systemOptions, targetFolder }) => {
      const { platform } = systemOptions
      if (!checkPlatformSupport(['win32', 'linux', 'darwin'], platform)) {
        return false
      }
      // TODO: Is this check correct?
      if (!checkTargetExist(targetFolder, 'You should install Visual Studio Code first!')) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('editor', 'vscode', 'default', 'keybindings.json'), target: join(targetFolder, 'keybindings.json') },
        { source: join('editor', 'vscode', 'default', 'settings.json'), target: join(targetFolder, 'settings.json') },
        { source: join('editor', 'vscode', 'default', 'mcp.json'), target: join(targetFolder, 'mcp.json') },
        { source: join('editor', 'vscode', 'default', 'global.code-snippets'), target: join(targetFolder, 'snippets', 'global.code-snippets') },
        { source: join('editor', 'vscode', 'default', 'comment.code-snippets'), target: join(targetFolder, 'snippets', 'comment.code-snippets') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
    posthandler: () => {
      consola.info('This configuration is meant to be used by `Visual Studio Code` in user scope.')
    },
  },
  // Cursor
  {
    id: 'cursor',
    name: 'setting up Cursor',
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      const targetMap: TargetMap = {
        win32: join(process.env.APPDATA!, 'Cursor', 'User'),
        linux: join(homedir(), '.config', 'Cursor', 'User'),
        darwin: join(homedir(), 'Library', 'Application Support', 'Cursor', 'User'),
      }
      return targetMap[platform] ?? ''
    },
    prehandler: ({ systemOptions, targetFolder }) => {
      const { platform } = systemOptions
      if (!checkPlatformSupport(['win32', 'linux', 'darwin'], platform)) {
        return false
      }
      // TODO: Is this check correct?
      if (!checkTargetExist(targetFolder, 'You should install Cursor first!')) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const mcpFolder = join(homedir(), '.cursor')
      ensureTargetFolderExist(mcpFolder)
      const handlerOperations = [
        { source: join('editor', 'vscode', 'default', 'keybindings.json'), target: join(targetFolder, 'keybindings.json') },
        { source: join('editor', 'vscode', 'default', 'settings.json'), target: join(targetFolder, 'settings.json') },
        { source: join('editor', 'cursor', 'mcp.json'), target: join(mcpFolder, 'mcp.json') },
        { source: join('editor', 'vscode', 'default', 'global.code-snippets'), target: join(targetFolder, 'snippets', 'global.code-snippets') },
        { source: join('editor', 'vscode', 'default', 'comment.code-snippets'), target: join(targetFolder, 'snippets', 'comment.code-snippets') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
    posthandler: () => {
      consola.info('This configuration is meant to be used by `Cursor` in user scope.')
    },
  },
  // Zed
  {
    id: 'zed',
    name: 'setting up Zed',
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      const targetMap: TargetMap = {
        win32: join(process.env.APPDATA!, 'Zed'),
        linux: join(homedir(), '.config', 'Zed'),
        darwin: join(homedir(), 'Library', 'Application Support', 'Zed'),
      }
      return targetMap[platform] ?? ''
    },
    prehandler: ({ systemOptions, targetFolder }) => {
      const { platform } = systemOptions
      if (!checkPlatformSupport(['win32', 'linux', 'darwin'], platform)) {
        return false
      }
      // TODO: Is this check correct?
      if (!checkTargetExist(targetFolder, 'You should install Zed first!')) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('editor', 'zed', 'settings.json'), target: join(targetFolder, 'settings.json') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
    posthandler: () => {
      consola.info('This configuration is meant to be used by `Zed` in user scope.')
    },
  },
  // Neo Vim
  {
    id: 'nvim',
    name: 'setting up Neo Vim',
    targetFolder: ({ systemOptions }) => {
      const { platform } = systemOptions
      return platform === 'win32'
        ? join(process.env.LOCALAPPDATA!, 'nvim')
        : join(homedir(), '.config', 'nvim')
    },
    prehandler: ({ targetFolder }) => {
      // TODO: Is this check correct?
      if (!checkTargetExist(
        [targetFolder, join(targetFolder, 'lazyvim.json')],
        'You should install Neo Vim and Lazy Vim first!',
      )) {
        return false
      }
      return true
    },
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('editor', 'nvim', 'init.lua'), target: join(targetFolder, 'init.lua') },
        { source: join('editor', 'nvim', 'lua', 'config', 'autocmds.lua'), target: join(targetFolder, 'lua', 'config', 'autocmds.lua') },
        { source: join('editor', 'nvim', 'lua', 'config', 'keymaps.lua'), target: join(targetFolder, 'lua', 'config', 'keymaps.lua') },
        { source: join('editor', 'nvim', 'lua', 'config', 'options.lua'), target: join(targetFolder, 'lua', 'config', 'options.lua') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
  },
  /* ------------------------------- 8. Linters ------------------------------- */
  // cSpell
  {
    id: 'cspell',
    name: 'setting up cSpell',
    targetFolder: homedir(),
    handler: async ({ options, targetFolder }) => {
      const handlerOperations = [
        { source: join('linter', 'cspell', '.cspell.common.txt'), target: join(targetFolder, '.cspell.common.txt') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, options)
      }
    },
    posthandler: () => {
      consola.info('I prefer using cSpell as an extension for Visual Studio Code, this configuration is meant to be used by the editor.')
    },
  },
]
