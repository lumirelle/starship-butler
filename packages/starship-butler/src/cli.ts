import type { ConfigProviderOptionsFromCommandLine } from 'starship-butler-config-provider'
import type { SystemOptions } from 'starship-butler-types'
import { platform } from 'node:os'
import process from 'node:process'
import cac from 'cac'
import { configureSystem } from 'starship-butler-config-provider'
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
  .command('configure-system', 'Let butler configure your system.')
  .alias('csys')
  .option('-i, --include [actions]', 'Include certain configure actions')
  .option('-x, --exclude [actions]', 'Exclude certain configure actions')
  .option('-f, --force', 'Force configure')
  .option('-?, --verbose', 'Show verbose output')
  .option('-d, --dry-run', 'Dry run')
  .option('-s, --symlink', 'Use symlink instead of copy')
  .option('-u, --no-fully-update', 'Disable fully update behavior')
  .action(async (options: Partial<ConfigProviderOptionsFromCommandLine>) => {
    const mergedOptions = mergeOptions(config, 'config-provider', options)
    await configureSystem(mergedOptions, systemOptions)
  })

cli.help()

cli.version(version)

cli.parse(process.argv)
