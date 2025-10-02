import type { SystemOptions } from 'starship-butler-types'
import type { SetSysOptions } from './set-sys'
import { homedir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import consola from 'consola'
import { fs } from 'starship-butler-utils'
import { processConfig } from './handler'

/**
 * Action interface for defining actions to run.
 */
export interface Action {
  /**
   * Action name
   */
  name: string
  /**
   * Prehandler for the action, if returns `false` or throw an error, the handler will not be executed.
   * @param options The options from user config and user command line input
   * @param systemOptions The options about system info
   * @returns Whether the action handler should be executed
   */
  prehandler?: (options: Partial<SetSysOptions>, systemOptions: SystemOptions) => Promise<boolean> | boolean
  /**
   * Handler for the action
   * @param options The options from user config and user command line input
   * @param systemOptions The options about system info
   */
  handler: (options: Partial<SetSysOptions>, systemOptions: SystemOptions) => Promise<void> | void
  /**
   * Run after handler is executed, useful for cleanup or other post-processing logic.
   * @param options The options from user config and user command line input
   * @param systemOptions The options about system info
   */
  posthandler?: (options: Partial<SetSysOptions>, systemOptions: SystemOptions) => Promise<void> | void
}

/**
 * Predefined actions to configure your system.
 */
export const DEFAULT_ACTIONS: Action[] = [
  /* ------------------------------- 1. Network ------------------------------- */
  // Clash Verge Rev
  {
    name: 'Setting Up Clash Verge Rev',
    prehandler: (_, systemOptions) => {
      const { userPlatform } = systemOptions
      const shouldRun = userPlatform === 'win32' || userPlatform === 'linux' || userPlatform === 'darwin'
      if (!shouldRun) {
        consola.info(`Clash Verge Rev: Just support win32, linux and darwin platform now.`)
      }
      return shouldRun
    },
    handler: async (options, systemOptions) => {
      const { userPlatform } = systemOptions
      const { force, symlink, dryRun } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = userPlatform === 'win32'
        ? join(process.env.APPDATA!, 'io.github.clash-verge-rev.clash-verge-rev', 'profiles')
        : userPlatform === 'linux'
          ? join(homedir(), '.local', 'shared', 'io.github.clash-verge-rev.clash-verge-rev', 'profiles')
          : userPlatform === 'darwin'
            ? join(homedir(), 'Library', 'Application Support', 'io.github.clash-verge-rev.clash-verge-rev', 'profiles')
            : ''

      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('network', 'clash-verge-rev', 'Script.js'), target: join(target, 'Script.js') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
  },
  /* ------------------------------ 2. Terminals ------------------------------ */
  // Windows Terminal
  {
    name: 'Setting Up Windows Terminal',
    prehandler: (_, systemOptions) => {
      const { userPlatform } = systemOptions
      const shouldRun = userPlatform === 'win32'
      if (!shouldRun) {
        consola.info(`Windows Terminal: Just support win32 platform.`)
      }
      return shouldRun
    },
    handler: async (options) => {
      const { force, symlink, dryRun } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = join(process.env.LOCALAPPDATA!, 'Packages', 'Microsoft.WindowsTerminal_8wekyb3d8bbwe', 'LocalState')
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('terminal', 'windows-terminal', 'settings.json'), target: join(target, 'settings.json') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
    posthandler: () => {
      consola.info('This configuration will use `"Go Mono", "Source Han Sans TC", "Symbols Nerd Font"` as terminal fonts.')
    },
  },
  /* -------------------------------- 3. Shells ------------------------------- */
  // Nushell
  {
    name: 'Setting Up Nushell',
    prehandler: (_, systemOptions) => {
      const { userPlatform } = systemOptions
      const shouldRun = userPlatform === 'win32' || userPlatform === 'linux' || userPlatform === 'darwin'
      if (!shouldRun) {
        consola.info(`NU: Just support win32, linux and darwin platform now.`)
      }
      return shouldRun
    },
    handler: async (options, systemOptions) => {
      const { force, symlink, dryRun } = options
      const { userPlatform } = systemOptions
      const mode = symlink ? 'symlink' : 'copy'
      const target = userPlatform === 'win32'
        ? join(process.env.APPDATA!, 'nushell')
        : userPlatform === 'linux'
          ? join(homedir(), '.config', 'nushell')
          : userPlatform === 'darwin'
            ? join(homedir(), 'Library', 'Application Support', 'nushell')
            : ''
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('shell', 'nu', 'utils.nu'), target: join(target, 'utils.nu') },
        { source: join('shell', 'nu', 'config.nu'), target: join(target, 'config.nu') },
        { source: join('shell', 'nu', 'env.nu'), target: join(target, 'env.nu') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
  },
  // Bash
  {
    name: 'Setting Up Bash',
    handler: async (options) => {
      const { force, symlink, dryRun } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = homedir()
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('shell', 'bash', '.bash_profile'), target: join(target, '.bash_profile') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
  },
  // CMD
  {
    name: 'Setting Up CMD',
    prehandler: (_, systemOptions) => {
      const { userPlatform } = systemOptions
      const shouldRun = userPlatform === 'win32'
      if (!shouldRun) {
        consola.info(`CMD: Just support win32 platform.`)
      }
      return shouldRun
    },
    handler: async (options) => {
      const { force, symlink, dryRun } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = join(homedir(), 'Documents', 'CMD')
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('shell', 'cmd', 'autorun.cmd'), target: join(target, 'autorun.cmd') },
        { source: join('shell', 'cmd', 'autorun.reg'), target: join(target, 'autorun.reg') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
    posthandler: () => {
      consola.info('Please running the `.reg` file under `~/Documents/CMD` with Registry Editor to enable autorun feature.')
    },
  },
  // PowerShell
  {
    name: 'Setting Up PowerShell',
    prehandler: (_, systemOptions) => {
      const { userPlatform } = systemOptions
      const shouldRun = userPlatform === 'win32' || userPlatform === 'linux' || userPlatform === 'darwin'
      if (!shouldRun) {
        consola.info(`PowerShell: Just support win32, linux and darwin platform now.`)
      }
      return shouldRun
    },
    handler: async (options, systemOptions) => {
      const { force, symlink, dryRun } = options
      const { userPlatform } = systemOptions
      const mode = symlink ? 'symlink' : 'copy'
      const target = userPlatform === 'win32'
        ? join(homedir(), 'Documents', 'PowerShell')
        : userPlatform === 'linux' || userPlatform === 'darwin'
          ? join(homedir(), '.config', 'powershell')
          : ''
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('shell', 'pwsh', 'profile.ps1'), target: join(target, 'profile.ps1') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
    posthandler: () => {
      consola.info('Please running `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` to allow local scripts to run.')
    },
  },
  /* --------------------------------- 4. VCS --------------------------------- */
  // Git
  {
    name: 'Setting Up Git',
    handler: async (options) => {
      const { force, symlink, dryRun } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = homedir()
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('vcs', 'git', '.gitconfig'), target: join(target, '.gitconfig') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
  },
  /* ------------------------- 5. PM (Package Manager) ------------------------ */
  // Maven
  {
    name: 'Setting Up Maven',
    handler: async (options) => {
      const { force, symlink, dryRun } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = join(homedir(), '.m2')
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('pm', 'maven', 'settings.xml'), target: join(target, 'settings.xml') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
  },
  /* -------------------------------- 6. Tools -------------------------------- */
  // @sxzz/create -- Creating projects
  {
    name: 'Setting Up @sxzz/create',
    handler: async (options) => {
      const { force, symlink, dryRun } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = join(homedir(), '.config')
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('tools', 'sxzz-create', 'create.config.yml'), target: join(target, 'create.config.yml') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
  },
  // simple-git-hooks -- Run with fnm environment
  {
    name: 'Setting Up simple-git-hooks',
    handler: async (options) => {
      const { force, symlink, dryRun } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = homedir()
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('tools', 'simple-git-hooks', '.simple-git-hooks.rc'), target: join(target, '.simple-git-hooks.rc') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
    posthandler: (_, systemOptions) => {
      const { userPlatform } = systemOptions
      const target = join(homedir(), '.simple-git-hooks.rc')
      consola.info('This configuration is aiming to run `simple-git-hooks` with `fnm` environment.')
      if (userPlatform === 'win32') {
        consola.info(`Notice that, you should add \`SIMPLE_GIT_HOOKS_RC=${target}\` to your system environment variables to let this configuration take effect.`)
      }
      else {
        consola.info(`Notice that, you should add \`SIMPLE_GIT_HOOKS_RC=${target}\` to your system environment variables at \`/etc/environment\` to let this configuration take effect.`)
      }
    },
  },
  // czg -- Git commit message generating tool
  {
    name: 'Setting Up czg',
    handler: async (options) => {
      const { force, symlink, dryRun } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = homedir()
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('tools', 'czg', '.czrc'), target: join(target, '.czrc') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
  },
  /* ------------------------------- 7. Editors ------------------------------- */
  // VSCode
  {
    name: 'Setting Up VSCode',
    prehandler: (_, systemOptions) => {
      const { userPlatform } = systemOptions
      const shouldRun = userPlatform === 'win32' || userPlatform === 'linux' || userPlatform === 'darwin'
      if (!shouldRun) {
        consola.info(`VSCode: Just support win32, linux and darwin platform now.`)
      }
      return shouldRun
    },
    handler: async (options, systemOptions) => {
      const { force, symlink, dryRun } = options
      const { userPlatform } = systemOptions
      const mode = symlink ? 'symlink' : 'copy'
      const target = userPlatform === 'win32'
        ? join(process.env.APPDATA!, 'Code', 'User')
        : userPlatform === 'linux'
          ? join(homedir(), '.config', 'Code', 'User')
          : userPlatform === 'darwin'
            ? join(homedir(), 'Library', 'Application Support', 'Code', 'User')
            : ''
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('editor', 'vscode', 'keybindings.json'), target: join(target, 'keybindings.json') },
        { source: join('editor', 'vscode', 'settings.json'), target: join(target, 'settings.json') },
        { source: join('editor', 'vscode', 'global.code-snippets'), target: join(target, 'snippets', 'global.code-snippets') },
        { source: join('editor', 'vscode', 'comment.code-snippets'), target: join(target, 'snippets', 'comment.code-snippets') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
    posthandler: () => {
      consola.info('This configuration is meant to be used by `Visual Studio Code` in user scope.')
    },
  },
  // Cursor
  {
    name: 'Setting Up Cursor',
    prehandler: (_, systemOptions) => {
      const { userPlatform } = systemOptions
      const shouldRun = userPlatform === 'win32' || userPlatform === 'linux' || userPlatform === 'darwin'
      if (!shouldRun) {
        consola.info(`Cursor: Just support win32, linux and darwin platform now.`)
      }
      return shouldRun
    },
    handler: async (options, systemOptions) => {
      const { force, symlink, dryRun } = options
      const { userPlatform } = systemOptions
      const mode = symlink ? 'symlink' : 'copy'
      const target = userPlatform === 'win32'
        ? join(process.env.APPDATA!, 'Cursor', 'User')
        : userPlatform === 'linux'
          ? join(homedir(), '.config', 'Cursor', 'User')
          : userPlatform === 'darwin'
            ? join(homedir(), 'Library', 'Application Support', 'Cursor', 'User')
            : ''
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('editor', 'vscode', 'keybindings.json'), target: join(target, 'keybindings.json') },
        { source: join('editor', 'vscode', 'settings.json'), target: join(target, 'settings.json') },
        { source: join('editor', 'vscode', 'global.code-snippets'), target: join(target, 'snippets', 'global.code-snippets') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
    posthandler: () => {
      consola.info('This configuration is meant to be used by `Cursor` in user scope.')
    },
  },
  // Neo Vim
  {
    name: 'Setting Up Neo Vim',
    prehandler: (_, systemOptions) => {
      const { userPlatform } = systemOptions
      const target = userPlatform === 'win32'
        ? join(process.env.LOCALAPPDATA!, 'nvim')
        : join(homedir(), '.config', 'nvim')
      if (!fs.existsSync(target) || !fs.existsSync(join(target, 'lazyvim.json'))) {
        consola.warn(`You should install Neo Vim and Lazy Vim first!`)
        return false
      }
      return true
    },
    handler: async (options, systemOptions) => {
      const { force, symlink, dryRun } = options
      const { userPlatform } = systemOptions
      const mode = symlink ? 'symlink' : 'copy'
      const target = userPlatform === 'win32'
        ? join(process.env.LOCALAPPDATA!, 'nvim')
        : join(homedir(), '.config', 'nvim')
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('editor', 'nvim', 'init.lua'), target: join(target, 'init.lua') },
        { source: join('editor', 'nvim', 'lua', 'config', 'autocmds.lua'), target: join(target, 'lua', 'config', 'autocmds.lua') },
        { source: join('editor', 'nvim', 'lua', 'config', 'keymaps.lua'), target: join(target, 'lua', 'config', 'keymaps.lua') },
        { source: join('editor', 'nvim', 'lua', 'config', 'options.lua'), target: join(target, 'lua', 'config', 'options.lua') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
  },
  /* ------------------------------- 8. Linters ------------------------------- */
  // cSpell
  {
    name: 'Setting Up cSpell',
    handler: async (options) => {
      const { force, symlink, dryRun } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = homedir()
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('linter', 'cspell', '.cspell.common.txt'), target: join(target, '.cspell.common.txt') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode, dryRun })
      }
    },
    posthandler: () => {
      consola.info('I prefer using cSpell as an extension for Visual Studio Code, this configuration is meant to be used by the editor.')
    },
  },
]
