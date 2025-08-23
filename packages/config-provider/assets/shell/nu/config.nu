# BANNER
$env.config.show_banner = 'short'

# EDITOR
$env.config.buffer_editor = 'code'

# HOOKS
$env.config.hooks.env_change.PWD = [
  # >> Setting up fnm
  # NOTE: fnm does not support nushell officially, so we need to use a workaround.
  # See: https://github.com/Schniz/fnm/issues/463
  {
    condition: {|| ['.nvmrc' '.node-version', 'package.json'] | any-path-exists}
    code: {|| ^fnm use --install-if-missing --corepack-enabled}
  }
  # >> Add current node_modules/.bin to PATH if this is a npm project, so we can run npm scripts without `npx`.
  {
    condition: {|| ['package.json'] | any-path-exists-parent}
    code: {|| $env.PATH = ($env.PATH | prepend (pwd | path join 'node_modules' | path join '.bin'))}
  }
]
