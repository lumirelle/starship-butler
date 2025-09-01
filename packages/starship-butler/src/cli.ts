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
  .command('csys', 'Let butler configure your system.')
  .option('-i, --include [actions]', 'Actions you want to include, default: `all`. Notice that, `include` has higher priority than `exclude`.')
  .option('-x, --exclude [actions]', 'Actions you want to exclude, default: `none`. Notice that, `include` has higher priority than `exclude`.')
  .option('-f, --force', 'Configure your system forcibly, override the existing configuration with the same name')
  .option('-?, --verbose', 'Show verbose output')
  .option('-d, --dry-run', 'Dry run')
  .option('-s, --symlink', 'Symlink configuration instead of copy and paste')
  .option('-u, --no-fully-update', 'Disable fully update behavior, default: false')
  .action(async (options: Partial<ConfigProviderOptionsFromCommandLine>) => {
    const mergedOptions = mergeOptions(config, 'config-provider', options)
    await configureSystem(mergedOptions, systemOptions)
  })

cli.help()

cli.version(version)

cli.parse(process.argv)
