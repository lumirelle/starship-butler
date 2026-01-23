import type { PresetOptions, SetOptions } from 'starship-butler-config-provider'
import type { SystemOptions } from 'starship-butler-types'
import { platform } from 'node:os'
import process from 'node:process'
import { confirm } from '@clack/prompts'
import cac from 'cac'
import consola, { LogLevels } from 'consola'
import defu from 'defu'
import { commandPreset, commandSet } from 'starship-butler-config-provider'
import { version } from '../package.json'
import { loadConfig } from './config'

const cli = cac('butler')

/**
 * User's configuration.
 */
const config = await loadConfig()

/**
 * Options contains user's system information.
 */
const systemOptions: SystemOptions = {
  platform: platform(),
}

cli
  .command('preset', 'Let butler preset application configurations for you.')
  // Aliases for backward compatibility, will be removed in next major version
  .alias('configure-system')
  .alias('cfsys')
  .option(
    '-i, --include <preset_id_regex>',
    `Presets that you want to include, accepts JavaScript regex pattern string(s).
Multiple value can be specified by separating them with commas.

  Example: butler preset -i clash-verge-rev,maven

Or pass parameter multiple times.

  Example: butler preset -i clash-verge-rev -i maven

(Default: none)
`,
  )
  .option(
    '-x, --exclude <preset_id_regex>',
    `Presets that you want to exclude (apply on included presets), accepts JavaScript
regex pattern string(s). Multiple value can be specified by separating them with commas.

  Example: butler preset -x clash-verge-rev,maven

Or pass parameter multiple times.

  Example: butler preset -x clash-verge-rev -x maven

(Default: none)
`,
  )
  .option(
    '-a, --all',
    `Applying all presets, overrides \`--include\` and \`--exclude\` options with \`"*"\` and
\`none\` whatever they are provided. (Default: false)
`,
  )
  .option(
    '-m, --mode <mode>',
    `Symlink or copy-paste configurations. (Default: "copy-paste")

STILL EXPERIMENTAL!
`,
  )
  .option(
    '-f, --force',
    `Preset application configurations forcibly, will override the existing
configuration with the same name. (Default: false)

MAKE SURE YOU KNOW WHAT YOU ARE DOING!
`,
  )
  .option(
    '-y, --agree-to-force',
    `Automatically agree to force option. (Default: false)

MAKE SURE YOU KNOW WHAT YOU ARE DOING!
`,
  )
  .option(
    '-?, --verbose',
    'Show verbose output. (Default: false)\n',
  )
  .option(
    '-d, --dry-run',
    'Dry run. (Default: false)\n',
  )
  .action(async (cliOptions: Partial<PresetOptions>) => {
    const cfgOptions: Partial<PresetOptions> = config['config-provider'] ?? {}
    if (cliOptions.verbose || cfgOptions.verbose)
      consola.level = LogLevels.debug
    consola.debug('[starship-butler] Received command line interface options:', cliOptions)
    consola.debug('[starship-butler] Loaded configuration options:', cfgOptions)
    const defaultOptions: Partial<PresetOptions> = {
      mode: 'copy-paste',
      force: false,
      agreeToForce: false,
      verbose: false,
      dryRun: false,
    }
    const mergedOptions = defu(cliOptions, cfgOptions, defaultOptions)
    consola.debug('[starship-butler] Merged options:', mergedOptions)
    if (mergedOptions.force && !mergedOptions.agreeToForce && !await confirm({
      message: 'Are you sure you want to configure your system forcibly? This will override the existing configuration with the same name, and cannot be undone!',
    })) {
      return
    }
    await commandPreset(mergedOptions, systemOptions)
  })

cli
  .command('set <source_pattern> <target>', 'Let butler set matched configurations for you.')
  .alias('configure')
  .alias('cf')
  .option(
    '-m, --mode <mode>',
    `Symlink or copy-paste configurations. (Default: "copy-paste")

STILL EXPERIMENTAL!
`,
  )
  .option(
    '-f, --force',
    `Set matched configurations forcibly, will override the existing
configuration with the same name. (Default: false)

MAKE SURE YOU KNOW WHAT YOU ARE DOING!
`,
  )
  .option(
    '-y, --agree-to-force',
    `Automatically agree to force option. (Default: false)

MAKE SURE YOU KNOW WHAT YOU ARE DOING!
`,
  )
  .option(
    '-?, --verbose',
    'Show verbose output. (Default: false)\n',
  )
  .option(
    '-d, --dry-run',
    'Dry run. (Default: false)\n',
  )
  .action(async (sourcePattern: string, target: string, cliOptions: Partial<SetOptions>) => {
    const cfgOptions: Partial<SetOptions> = config['config-provider'] ?? {}
    if (cfgOptions.verbose || cliOptions.verbose)
      consola.level = LogLevels.debug
    consola.debug('[starship-butler] Received command line interface options:', cliOptions)
    consola.debug('[starship-butler] Loaded configuration options:', cfgOptions)
    const defaultOptions: Partial<SetOptions> = {
      mode: 'copy-paste',
      force: false,
      agreeToForce: false,
      verbose: false,
      dryRun: false,
    }
    const mergedOptions = defu(cliOptions, cfgOptions, defaultOptions)
    consola.debug('[starship-butler] Merged options:', mergedOptions)
    if (mergedOptions.force && !mergedOptions.agreeToForce && !await confirm({
      message: 'Are you sure you want to set matched configurations forcibly? This will override the existing configuration with the same name, and cannot be undone!',
    })) {
      return
    }
    await commandSet(sourcePattern, target, mergedOptions)
  })

cli.help()

cli.version(version)

cli.parse(process.argv)
