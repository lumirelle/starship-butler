import type { ConfigureOptions } from './types'
import process from 'node:process'
import { loadConfig } from 'c12'
import cac from 'cac'
import { name, version } from '../package.json'
import { runActions } from './configure'
import { mergeOptions } from './utils'

const { config: configOptions } = await loadConfig({ name: 'butler' })

const cli = cac(name)

cli
  .command('configure', 'Let bulter configure you system.')
  .alias('conf')
  .option('--include, -n [actions]', 'Include certain configure actions')
  .option('--exclude, -x [actions]', 'Exclude certain configure actions')
  .option('--force, -f', 'Force configure')
  .option('--verbose, -?', 'Show verbose output')
  .option('--dry-run, -d', 'Dry run')
  .action((options: Partial<ConfigureOptions>) => {
    runActions(mergeOptions(configOptions, options))
  })

cli.help()

cli.version(version)

cli.parse(process.argv)
