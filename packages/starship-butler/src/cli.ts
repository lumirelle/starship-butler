import type { SetOptionsFromCommandLine, SetOptionsFromConfig, SetSysOptionsFromCommandLine, SetSysOptionsFromConfig } from 'starship-butler-config-provider'
import type { SystemOptions } from 'starship-butler-types'
import { platform } from 'node:os'
import process from 'node:process'
import cac from 'cac'
import consola, { LogLevels } from 'consola'
import { settingUp, settingUpSystem } from 'starship-butler-config-provider'
import { name, version } from '../package.json'
import { loadConfig, mergeOptions } from './config'

const cli = cac(name)

const config = await loadConfig()

/**
 * User system info
 */
const systemOptions: SystemOptions = {
  userPlatform: platform(),
}

cli
  .command('set-sys', 'Let butler setting up your system.')
  .option('-i, --include [actions]', 'Actions you want to include, default: `all`. Notice that, `include` has higher priority than `exclude`.')
  .option('-x, --exclude [actions]', 'Actions you want to exclude, default: `none`. Notice that, `include` has higher priority than `exclude`.')
  .option('-f, --force', 'Configure your system forcibly, override the existing configuration with the same name')
  .option('-?, --verbose', 'Show verbose output')
  .option('-d, --dry-run', 'Dry run')
  .option('-s, --symlink', 'Symlink configuration instead of copy and paste')
  .option('-u, --no-fully-update', 'Disable fully update behavior, default: false')
  .action(async (options: Partial<SetSysOptionsFromCommandLine>) => {
    // Use type to limit the usage of config options
    const configOptions = config['config-provider'] as Partial<SetSysOptionsFromConfig>
    if (configOptions.verbose || options.verbose) {
      consola.level = LogLevels.debug
    }
    const mergedOptions = mergeOptions(configOptions, options)
    await settingUpSystem(mergedOptions, systemOptions)
  })

cli
  .command('set <source> <target>', 'Let butler setting up locally.')
  .option('-f, --force', 'Configure locally and forcibly, override the existing configuration with the same name')
  .option('-?, --verbose', 'Show verbose output')
  .option('-d, --dry-run', 'Dry run')
  .option('-s, --symlink', 'Symlink configuration instead of copy and paste')
  .action(async (source: string, target: string, options: Partial<SetOptionsFromCommandLine>) => {
    // Use type to limit the usage of config options
    const configOptions = config['config-provider'] as Partial<SetOptionsFromConfig>
    if (configOptions.verbose || options.verbose) {
      consola.level = LogLevels.debug
    }
    const mergedOptions = mergeOptions(configOptions, options)
    await settingUp(source, target, mergedOptions)
  })

cli.help()

cli.version(version)

cli.parse(process.argv)
