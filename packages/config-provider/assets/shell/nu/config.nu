use utils.nu

# BANNER
$env.config.show_banner = 'short'

# EDITOR
$env.config.buffer_editor = 'code'

# HOOKS
$env.config.hooks.env_change.PWD = [
  # >> Setting up fnm
  # NOTE: fnm does not support nushell officially, so we need to use a workaround.
  # See related issue https://github.com/Schniz/fnm/issues/463 and PowerShell example https://github.com/Schniz/fnm/blob/master/src/shell/powershell.rs
  # {
  #   condition: {|| ['.nvmrc' '.node-version', 'package.json'] | utils any-path-exists}
  #   # Temporary fix the loading issue following https://github.com/Schniz/fnm/issues/463#issuecomment-3022203794
  #   code: {|| ^fnm use --silent-if-unchanged --install-if-missing}
  # }
  # >> Add current `node_modules/.bin` to `$env.Path` if we are in a npm project, so we can run npm scripts without `npx`.
  {
    condition: {|| ['package.json'] | utils any-path-exists-parent}
    code: {||
      let $node_modules_path = 'node_modules' | path join '.bin'
      let $new_path = 'package.json' | utils dirname-parent | path join $node_modules_path
      let $index_of_node_modules_path = $env.Path | enumerate | where {|e| $e.item | str ends-with $node_modules_path } | get index
      if ($index_of_node_modules_path | is-empty) {
        # If `node_modules/.bin` is not in the path, prepend it
        $env.Path = ($env.Path | prepend $new_path)
      } else {
        # If `node_modules/.bin` is already in the path, update it
        $env.Path = ($env.Path | update $index_of_node_modules_path.0 $new_path)
      }
    }
  }
]
