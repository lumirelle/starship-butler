# Prompt UI
eval "$(starship init bash)"

# Environment
## Mise, https://mise.jdx.dev/
eval "$(mise activate bash)"
## Podman
export PODMAN_COMPOSE_WARNING_LOGS=false

# Commands Aliases
# For container management
alias docker='podman'
alias compose='podman compose'
