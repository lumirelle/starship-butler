# ----------------------------------- UTILS- --------------------------------- #

# Check if any path exists in the current directory.
any-path-exists() {
  for path in "$@"; do
    if [ -e "$path" ]; then
      return 0
    fi
  done
  return 1
}

# Check if any path exists in the current directory or any of its parent directories.
any-path-exists-parent() {
  for path in "$@"; do
    if [ -e "$path" ]; then
      return 0
    fi
    local abs=$(realpath "$path")
    local level=$(echo "$abs" | tr '/' '\n' | wc -l | awk '{print $1 - 1}')
    for i in $(seq 2 $level); do
      local dir=$(echo "$abs" | tr '/' '\n' | head -n $i | tr '\n' '/' | sed 's:/$::')
      local new_path="$dir/$path"
      if [ -e "$new_path" ]; then
        return 0
      fi
    done
  done
  return 1
}

# Find out the dirname of the specified path both cwd & parent.
dirname-parent() {
  local path="$1"
  local abs=$(realpath "$path")
  local level=$(echo "$abs" | tr '/' '\n' | wc -l | awk '{print $1 - 1}')
  for i in $(seq 2 $level); do
    local dir=$(echo "$abs" | tr '/' '\n' | head -n $i | tr '\n' '/' | sed 's:/$::')
    local new_path="$dir/$path"
    if [ -e "$new_path" ]; then
      # Bash function can only return number (0~255)
      # We should store the dirname to a variable
      dirname="$dir"
      return 0
    fi
  done
  return 1
}

# Wrapper for running node packages' scripts
nr-wrapper() {
  if not any-path-exists-parent package.json; then
    return
  fi
  if [ -x "$(command -v nr)" ]; then
    nr -- "$@"
  else
    echo "Warning: \`@antfu/ni\` is not installed as a global node package."
  fi
}

# ------------------------------------ ENV ----------------------------------- #

# UI
eval "$(starship init bash)"

export PODMAN_COMPOSE_WARNING_LOGS=false

# Commands Aliases
# For running node packages' scripts
alias dev='nr-wrapper dev'
alias build='nr-wrapper build'
alias start='nr-wrapper start'
alias docs='nr-wrapper docs'
alias play='nr-wrapper play'
alias lint='nr-wrapper lint'
alias typecheck='nr-wrapper typecheck'
alias usagecheck='nr-wrapper usagecheck'
alias check='nr-wrapper check'
alias test='nr-wrapper test'
alias release='nr-wrapper release'
# For container management
alias docker='podman'
alias compose='podman compose'
