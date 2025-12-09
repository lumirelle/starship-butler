import type { ConfigureOptions, ConfigureSystemOptions } from 'starship-butler-config-provider'
import type { SystemOptions } from 'starship-butler-types'
import { platform } from 'node:os'
import process from 'node:process'
import { unindent } from '@antfu/utils'
import { confirm } from '@clack/prompts'
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
  .command('preset', 'Let butler preset application configurations for you.')
  .option(
    '-i, --include <preset_id_regex>',
    unindent`
      Presets that you want to include, accepts JavaScript regex pattern string.
      Multiple value can be specified by separating them with commas, e.g.:
        butler preset -i clash-verge-rev,maven
      Or pass parameter multiple times, e.g.:
        butler preset -i clash-verge-rev -i maven
      (Default: "*")
    `,
  )
  .option(
    '-x, --exclude <preset_id_regex>',
    unindent`
      Presets that you want to exclude (apply on included presets), accepts JavaScript regex pattern string.
      Multiple value can be specified by separating them with commas, e.g.:
        butler preset -x clash-verge-rev,maven
      Or pass parameter multiple times, e.g.:
        butler preset -x clash-verge-rev -x maven
      (Default: none)
    `,
  )
  .option(
    '-f, --force',
    unindent`
      Let butler configure your system forcibly, will override the existing configuration with the same name.
      Make sure you know what you are doing!
    `,
  )
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
    if (mergedOptions.force && await confirm({
      message: 'Are you sure you want to configure your system forcibly? This will override the existing configuration with the same name, and cannot be undone!',
    })) {
      await configureSystem(mergedOptions, systemOptions)
    }
  })

cli
  .command('configure <sourcePattern> <target>', 'Let butler provide configuration locally.')
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
