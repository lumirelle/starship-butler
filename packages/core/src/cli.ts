import type { ConfigureOptions, ConfigureSystemOptions } from 'starship-butler-config-provider'
import type { SystemOptions } from 'starship-butler-types'
import { platform } from 'node:os'
import process from 'node:process'
import cac from 'cac'
import consola, { LogLevels } from 'consola'
import { configure, configureSystem } from 'starship-butler-config-provider'
import { version } from '../package.json'
import { loadConfig, mergeOptions } from './config'

const cli = cac('butler')

const config = await loadConfig()

/**
 * Options contains user's system information.
 */
const systemOptions: SystemOptions = {
  platform: platform(),
}

cli
  .command('configure-system', 'Let butler configure your system.')
  .alias('cfsys')
  .option('-i, --includeOnly <actionIds>', 'Preset configuring actions that are included only.')
  .option('-x, --exclude <actionIds>', 'Preset configuring actions that are excluded.')
  .option('-f, --force', 'Let butler configure your system forcibly, will override the existing configuration with the same name')
  .option('-?, --verbose', 'Show verbose output')
  .option('-d, --dry-run', 'Dry run')
  .option('-m, --mode <mode>', 'Symlink or copy-paste configuration, default is copy-paste. CAUTION: Symlink mode is experimental now.')
  .action(async (cliOptions: Partial<ConfigureSystemOptions>) => {
    // Use type to limit the usage of config options
    const cfgOptions = config['config-provider'] ?? {} as Partial<ConfigureSystemOptions>
    if (cfgOptions.verbose || cliOptions.verbose) {
      consola.level = LogLevels.debug
    }
    const mergedOptions = mergeOptions(cfgOptions, cliOptions)
    await configureSystem(mergedOptions, systemOptions)
  })

cli
  .command('configure <sourcePattern> <target>', 'Let butler setting up locally, `sourcePattern` is support both file path and glob pattern.')
  .alias('cf')
  .option('-f, --force', 'Let butler configure locally and forcibly, will override the existing configuration with the same name')
  .option('-?, --verbose', 'Show verbose output')
  .option('-d, --dry-run', 'Dry run')
  .option('-m, --mode <mode>', 'Symlink or copy-paste configuration, default is copy-paste. CAUTION: Symlink mode is experimental now.')
  .action(async (sourcePattern: string, target: string, cliOptions: Partial<ConfigureOptions>) => {
    // Use type to limit the usage of config options
    const configOptions = config['config-provider'] ?? {} as Partial<ConfigureOptions>
    if (configOptions.verbose || cliOptions.verbose) {
      consola.level = LogLevels.debug
    }
    const mergedOptions = mergeOptions(configOptions, cliOptions)
    await configure(sourcePattern, target, mergedOptions)
  })

cli.help()

cli.version(version)

cli.parse(process.argv)
