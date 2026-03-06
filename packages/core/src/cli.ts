import type { PresetOptions } from 'starship-butler-config-provider/command/preset'
import type { SetOptions } from 'starship-butler-config-provider/command/set'
import type { SystemOptions } from 'starship-butler-types'
import { platform } from 'node:os'
import process from 'node:process'
import { confirm } from '@clack/prompts'
import { cac } from 'cac'
import { consola, LogLevels } from 'consola'
import { defu } from 'defu'
import { commandPreset } from 'starship-butler-config-provider/command/preset'
import { commandSet } from 'starship-butler-config-provider/command/set'
import { version } from '../package.json'
import { loadConfig } from './config'

const userConfig = await loadConfig()
const systemOptions: SystemOptions = {
  platform: platform(),
}

const cli = cac('butler')

cli
  .command('preset', 'Let butler preset application configurations for you.')
  .option(
    '-i, --include <regex1,regex2,...>',
    'Presets that you want to include, accepts JavaScript regex pattern string(s). Multiple value can be specified by separating them with commas.',
  )
  .option(
    '-x, --exclude <regex1,regex2,...>',
    'Presets that you want to exclude (apply on included presets), accepts JavaScript regex pattern string(s). Multiple value can be specified by separating them with commas.',
  )
  .option(
    '-a, --all',
    'Applying all presets, overrides `--include` and `--exclude` options with `"*"` and `none` whatever they are provided.',
    { default: false },
  )
  .option(
    '-m, --mode <mode>',
    'STILL EXPERIMENTAL! Symlink or copy-paste configurations.',
    { default: 'copy-paste' },
  )
  .option(
    '-f, --force',
    'MAKE SURE YOU KNOW WHAT YOU ARE DOING! Preset application configurations forcibly, will override the existing configuration with the same name.',
    { default: false },
  )
  .option(
    '-y, --agree-to-force',
    'MAKE SURE YOU KNOW WHAT YOU ARE DOING! Automatically agree to force option.',
    { default: false },
  )
  .option(
    '-?, --verbose',
    'Show verbose output.',
    { default: false },
  )
  .option(
    '-d, --dry-run',
    'Dry run.',
    { default: false },
  )
  .example('butler preset -i clash-verge-rev,maven')
  .example('butler preset -i clash-verge-rev -i maven')
  .example('butler preset -a -x clash-verge-rev')
  .example('butler preset -a -x clash-verge-rev -x maven')
  .example('butler preset -af')
  .action(async (cliOptions: Partial<PresetOptions>) => {
    const cfgOptions: Partial<PresetOptions> = userConfig['config-provider'] ?? {}
    if (cliOptions.verbose || cfgOptions.verbose) {
      consola.level = LogLevels.debug
    }
    consola.debug('[core] Received command line interface options:', cliOptions)
    consola.debug('[core] Loaded configuration options:', cfgOptions)
    const defaultOptions: Partial<PresetOptions> = {
      mode: 'copy-paste',
      force: false,
      agreeToForce: false,
      verbose: false,
      dryRun: false,
    }
    const mergedOptions = defu(cliOptions, cfgOptions, defaultOptions)
    consola.debug('[core] Merged options:', mergedOptions)
    if (
      mergedOptions.force
      && !mergedOptions.agreeToForce
      && !(await confirm({
        message:
          'Are you sure you want to configure your system forcibly? This will override the existing configuration with the same name, and cannot be undone!',
      }))
    ) {
      return
    }
    await commandPreset(mergedOptions, systemOptions)
  })

cli
  .command('set <source_pattern> <target>', 'Let butler set matched configurations for you.')
  .option(
    '-m, --mode <mode>',
    'STILL EXPERIMENTAL! Symlink or copy-paste configurations.',
    {
      default: 'copy-paste',
    },
  )
  .option(
    '-f, --force',
    'MAKE SURE YOU KNOW WHAT YOU ARE DOING! Set matched configurations forcibly, will override the existing configuration with the same name.',
    {
      default: false,
    },
  )
  .option(
    '-y, --agree-to-force',
    'MAKE SURE YOU KNOW WHAT YOU ARE DOING! Automatically agree to force option.',
    {
      default: false,
    },
  )
  .option(
    '-?, --verbose',
    'Show verbose output.',
    {
      default: false,
    },
  )
  .option(
    '-d, --dry-run',
    'Dry run.',
    { default: false },
  )
  .action(async (sourcePattern: string, target: string, cliOptions: Partial<SetOptions>) => {
    const cfgOptions: Partial<SetOptions> = userConfig['config-provider'] ?? {}
    if (cfgOptions.verbose || cliOptions.verbose) {
      consola.level = LogLevels.debug
    }
    consola.debug('[core] Received command line interface options:', cliOptions)
    consola.debug('[core] Loaded configuration options:', cfgOptions)
    const defaultOptions: Partial<SetOptions> = {
      mode: 'copy-paste',
      force: false,
      agreeToForce: false,
      verbose: false,
      dryRun: false,
    }
    const mergedOptions = defu(cliOptions, cfgOptions, defaultOptions)
    consola.debug('[core] Merged options:', mergedOptions)
    if (
      mergedOptions.force
      && !mergedOptions.agreeToForce
      && !(await confirm({
        message:
          'Are you sure you want to set matched configurations forcibly? This will override the existing configuration with the same name, and cannot be undone!',
      }))
    ) {
      return
    }
    await commandSet(sourcePattern, target, mergedOptions)
  })

cli.help()

cli.version(version)

cli.parse(process.argv)
