import type { Action, PresetOptions } from './types'
import { toArray } from '@antfu/utils'
import { multiselect } from '@clack/prompts'
import { consola } from 'consola'
import { important } from 'starship-butler-utils/highlight'
import { cursor } from './actions/editor/cursor'
import { neovim } from './actions/editor/neovim'
import { vscode } from './actions/editor/vscode'
import { zed } from './actions/editor/zed'
import { rime } from './actions/input_method/rime'
import { cSpell } from './actions/linter/c_spell'
import { clashVergeRev } from './actions/network/clash_verge_rev'
import { maven } from './actions/pm/maven'
import { bash } from './actions/shell/bash'
import { nushell } from './actions/shell/nushell'
import { powershell } from './actions/shell/powershell'
import { windowsPowerShell } from './actions/shell/windows_powershell'
import { starship } from './actions/shell_prompt/starship'
import { windowsTerminal } from './actions/terminal/windows_terminal'
import { sxzzCreate } from './actions/tools/sxzz_create'
import { git } from './actions/vcs/git'

/**
 * Preset actions.
 *
 * @private
 */
const _ACTIONS: (Action | undefined)[] = [
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

export async function filterActions(options: PresetOptions): Promise<Action[]> {
  const actions = _ACTIONS.filter(Boolean) as Action[]

  let include = toArray(options.include)
  let exclude = toArray(options.exclude)
  // If user wants to list / apply all available presets, we filter out them without regard to include and exclude options
  if (options.all || options.list) {
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
      options: actions.map(action => ({ value: action.id, label: action.name })),
    })) as string[]
  }
  const includedActions = actions.filter((action) => {
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
