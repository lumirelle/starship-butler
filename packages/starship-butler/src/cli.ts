import type { ConfigProviderOptionsFromCommandLine } from 'starship-butler-config-provider'
import process from 'node:process'
import cac from 'cac'
import { runActions } from 'starship-butler-config-provider'
import { name, version } from '../package.json'
import { loadConfig, mergeOptions } from './utils'

const config = await loadConfig()

const cli = cac(name)

cli
  .command('configure', 'Let butler configure your system.')
  .alias('conf')
  .option('--include, -n [actions]', 'Include certain configure actions')
  .option('--exclude, -x [actions]', 'Exclude certain configure actions')
  .option('--force, -f', 'Force configure')
  .option('--verbose, -?', 'Show verbose output')
  .option('--dry-run, -d', 'Dry run')
  .option('--symlink, -s', 'Use symlink instead of copy')
  .action(async (options: Partial<ConfigProviderOptionsFromCommandLine>) => {
    await runActions(mergeOptions(config, 'config-provider', options))
  })

cli.help()

cli.version(version)

cli.parse(process.argv)
