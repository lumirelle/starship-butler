use utils.nu

# LANGUAGE & ENCODING
# TODO: Setting the language to English and the encoding to UTF-8, is it correct?
$env.LANG = 'en_US.UTF-8'
$env.LC_ALL = 'en_US.UTF-8'

# $PATH
# >> Setting up fnm
# NOTE: fnm does not support nushell officially, so we need to use a workaround.
# See related issue https://github.com/Schniz/fnm/issues/463 and PowerShell example https://github.com/Schniz/fnm/blob/master/src/shell/powershell.rs
# if not (which fnm | is-empty) {
#   ^fnm env --corepack-enabled --json | from json | load-env
#   $env.Path = $env.Path | prepend ($env.FNM_MULTISHELL_PATH | path join (if $nu.os-info.name == 'windows' {''} else {'bin'}))
# }

# UI
mkdir ($nu.data-dir | path join "vendor/autoload")
starship init nu | save -f ($nu.data-dir | path join "vendor/autoload/starship.nu")

# COMMAND SHORTCUTS
# Run npm scripts quickly while we are in a directory that has a `package.json`.
alias dev = utils nr-agent dev
alias play = utils nr-agent play
alias build = utils nr-agent build
alias start = utils nr-agent start
alias lint = utils nr-agent lint
alias test = utils nr-agent test
alias typecheck = utils nr-agent typecheck
alias docs = utils nr-agent docs
alias release = utils nr-agent release
