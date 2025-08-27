import type { Action } from './types'
import { homedir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import consola from 'consola'
import { fs } from 'starship-butler-utils'
import { processConfig } from './handler'

/**
 * Predefined actions to configure your system.
 */
export const DEFAULT_ACTIONS: Action[] = [
  /* --------------------------------- Shells --------------------------------- */
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
      const { force, symlink } = options
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
        await processConfig(operation.source, operation.target, { force, mode })
      }
    },
  },
  // Bash
  {
    name: 'Setting Up Bash',
    handler: async (options) => {
      const { force, symlink } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = homedir()
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('shell', 'bash', '.bash_profile'), target: join(target, '.bash_profile') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode })
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
      const { force, symlink } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = join(homedir(), 'Documents', 'CMD')
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('shell', 'cmd', 'autorun.cmd'), target: join(target, 'autorun.cmd') },
        { source: join('shell', 'cmd', 'autorun.reg'), target: join(target, 'autorun.reg') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode })
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
      const { force, symlink } = options
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
        await processConfig(operation.source, operation.target, { force, mode })
      }
    },
    posthandler: () => {
      consola.info('Please running `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` to allow local scripts to run.')
    },
  },
  /* -------------------------------- Terminals ------------------------------- */
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
      const { force, symlink } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = join(process.env.LOCALAPPDATA!, 'Packages', 'Microsoft.WindowsTerminal_8wekyb3d8bbwe', 'LocalState')
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('terminal', 'windows-terminal', 'settings.json'), target: join(target, 'settings.json') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode })
      }
    },
    posthandler: () => {
      consola.info('This configuration will use `"Fantasque Sans Mono", "Source Han Sans TC", "Symbols Nerd Font"` as terminal fonts.')
    },
  },
  /* -------------------------------- VPN ------------------------------- */
  // Clash for Windows
  {
    name: 'Setting Up Clash for Windows',
    prehandler: (_, systemOptions) => {
      const { userPlatform } = systemOptions
      const shouldRun = userPlatform === 'win32'
      if (!shouldRun) {
        consola.info(`Clash for Windows: Just support win32 platform.`)
      }
      return shouldRun
    },
    handler: async (options) => {
      const { force, symlink } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = join(homedir(), '.config', 'clash')
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('vpn', 'clash-for-windows', 'cfw-settings.yaml'), target: join(target, 'cfw-settings.yaml') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode })
      }
    },
  },
  /* ----------------------------------- VCS ---------------------------------- */
  // Git
  {
    name: 'Setting Up Git',
    handler: async (options) => {
      const { force, symlink } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = homedir()
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('vcs', 'git', '.gitconfig'), target: join(target, '.gitconfig') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode })
      }
    },
  },
  /* ---------------------------------- Tools --------------------------------- */
  // @sxzz/creator -- Creating projects
  {
    name: 'Setting Up @sxzz/creator',
    handler: async (options) => {
      const { force, symlink } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = join(homedir(), '.config')
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('tools', 'sxzz-creator', 'create.config.yml'), target: join(target, 'create.config.yml') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode })
      }
    },
  },
  // simple-git-hooks -- Run with fnm environment
  {
    name: 'Setting Up simple-git-hooks',
    handler: async (options) => {
      const { force, symlink } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = homedir()
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('tools', 'simple-git-hooks', '.simple-git-hooks.rc'), target: join(target, '.simple-git-hooks.rc') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode })
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
      const { force, symlink } = options
      const mode = symlink ? 'symlink' : 'copy'
      const target = homedir()
      fs.ensureDir(target)
      const handlerOperations = [
        { source: join('tools', 'czg', '.czrc'), target: join(target, '.czrc') },
      ]
      for (const operation of handlerOperations) {
        await processConfig(operation.source, operation.target, { force, mode })
      }
    },
  },
]
