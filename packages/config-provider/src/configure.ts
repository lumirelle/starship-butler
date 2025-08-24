import type { ConfigProviderOptions } from './types'
import consola from 'consola'
import semver from 'semver'
import { updateOrCreateUserRc } from 'starship-butler-utils'
import { version as versionInPackage } from '../package.json'
import { filterActions } from './actions'

/**
 * Running actions to configure your system. The entry of this package.
 * @param options User configuration and command line options
 */
export async function runActions(options: Partial<ConfigProviderOptions>): Promise<void> {
  // If `version` is provided, that means the user already configured his/her system before
  // If that `version` is lower than the current package version, we will force update
  const needUpdate = Boolean((options.version && semver.lt(options.version, versionInPackage)))
  if (needUpdate) {
    consola.info(`Detect global .butlerrc file with old version ${options.version}, will force update all config.`)
    options.force = true
  }

  consola.debug('[config-provider] Running actions with options:', options)

  if (options.include && options.exclude) {
    consola.warn('Don\'t specify both include and exclude options. Notice that, Include has higher priority than exclude.')
  }

  const filteredActions = filterActions(options)

  consola.debug(`[config-provider] Found ${filteredActions.length} actions to run.`)

  for (const action of filteredActions) {
    let shouldRun = true
    if (action.prehandler) {
      try {
        shouldRun = await action.prehandler(options)
      }
      catch (error) {
        shouldRun = false
        consola.error(`Error in prehandler of "${action.name}", action stopped:`, error)
        return
      }
    }

    if (!shouldRun) {
      consola.debug(`[config-provider] Skipping "${action.name}" because prehandler returned false or threw an error.`)
      return
    }

    consola.info(`Running "${action.name}"...`)
    await action.handler(options)

    if (action.posthandler) {
      consola.debug(`[config-provider] Running posthandler for "${action.name}"...`)
      await action.posthandler(options)
    }
  }

  // Update last configuring timestamp
  updateOrCreateUserRc('.butlerrc', {
    'config-provider': {
      version: versionInPackage,
    },
  })
}
