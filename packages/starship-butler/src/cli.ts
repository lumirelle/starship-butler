import type { ConfigProviderOptionsFromCommandLine } from 'starship-butler-config-provider'
import type { SystemOptions } from 'starship-butler-types'
import { platform } from 'node:os'
import process from 'node:process'
import cac from 'cac'
import { runActions } from 'starship-butler-config-provider'
import { name, version } from '../package.json'
import { loadConfig, mergeOptions } from './config'

const config = await loadConfig()

const cli = cac(name)

/**
 * User system info
 */
const systemOptions: SystemOptions = {
  userPlatform: platform(),
}

cli
  .command('configure', 'Let butler configure your system.')
  .alias('conf')
  .option('-n, --include [actions]', 'Include certain configure actions')
  .option('-x, --exclude [actions]', 'Exclude certain configure actions')
  .option('-f, --force', 'Force configure')
  .option('-?, --verbose', 'Show verbose output')
  .option('-d, --dry-run', 'Dry run')
  .option('-s, --symlink', 'Use symlink instead of copy')
  .action(async (options: Partial<ConfigProviderOptionsFromCommandLine>) => {
    await runActions(mergeOptions(config, 'config-provider', options), systemOptions)
  })

cli.help()

cli.version(version)

cli.parse(process.argv)
