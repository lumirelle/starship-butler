use utils.nu *

# UI
mkdir ($nu.data-dir | path join "vendor/autoload")
starship init nu | save -f ($nu.data-dir | path join "vendor/autoload/starship.nu")

# Commands Aliases
# For running node packages' scripts
alias dev = nr-wrapper dev
alias build = nr-wrapper build
alias start = nr-wrapper start
alias docs = nr-wrapper docs
alias play = nr-wrapper play
alias lint = nr-wrapper lint
alias test = nr-wrapper test
alias typecheck = nr-wrapper typecheck
alias release = nr-wrapper release
