import type { Action, PresetOptions } from './types'
import { toArray } from '@antfu/utils'
import consola from 'starship-butler-utils/consola'
import { important } from 'starship-butler-utils/highlight'
import { multiselect } from 'starship-butler-utils/prompts'
import { cursor } from './actions/editor/cursor'
import { neovim } from './actions/editor/neovim'
import { vscode } from './actions/editor/vscode'
import { zed } from './actions/editor/zed'
import { rime } from './actions/input-method/rime'
import { cSpell } from './actions/linter/c-spell'
import { clashVergeRev } from './actions/network/clash-verge-rev'
import { bun } from './actions/pm/bun'
import { maven } from './actions/pm/maven'
import { starship } from './actions/shell-prompt/starship'
import { bash } from './actions/shell/bash'
import { nushell } from './actions/shell/nushell'
import { powershell } from './actions/shell/powershell'
import { windowsPowerShell } from './actions/shell/windows-powershell'
import { windowsTerminal } from './actions/terminal/windows-terminal'
import { sxzzCreate } from './actions/tools/sxzz-create'
import { git } from './actions/vcs/git'

/**
 * Preset actions.
 *
 * @private
 */
const _ACTIONS: Action[] = [
  // Network
  clashVergeRev(),
  // Input Methods
  rime(),
  // Terminal & Shell & Prompt
  windowsTerminal(),
  nushell(),
  bash(),
  powershell(),
  windowsPowerShell(),
  starship(),
  // VCS
  git(),
  // Package Manager
  bun(),
  maven(),
  // Tools
  sxzzCreate(),
  // Editors
  vscode(),
  cursor(),
  zed(),
  neovim(),
  // Linters
  cSpell(),
]

export async function filterActions(options: Partial<PresetOptions>): Promise<Action[]> {
  let include = toArray(options.include)
  let exclude = toArray(options.exclude)
  if (options.all) {
    // TODO(Lumirelle): Use glob instead regex?
    include = ['.*']
    exclude = []
    consola.debug('[config-provider] "all" option is set, overriding include and exclude options accordingly.')
    consola.debug('[config-provider] Updated include and exclude:', { include, exclude })
  }
  // If include is empty, then prompt user to select actions...
  if (include.length === 0) {
    include = (await multiselect({
      message: 'No actions specified to include. Please select the actions you want to include:',
      options: _ACTIONS.map(action => ({ value: action.id, label: action.name })),
    })) as string[]
  }
  const includedActions = _ACTIONS.filter((action) => {
    const isIncluded = include.some(pattern => new RegExp(pattern).test(action.id))
    if (!isIncluded) {
      consola.debug(`[config-provider] Skip "${important(action.name)}" as it's not included.`)
      return false
    }
    return true
  })
  const notExcludedActions = includedActions.filter((action) => {
    const isNotExcluded = !exclude.some(pattern => new RegExp(pattern).test(action.id))
    if (!isNotExcluded) {
      consola.debug(`[config-provider] Skip "${important(action.name)}" as it's excluded.`)
      return false
    }
    return true
  })
  return notExcludedActions
}
