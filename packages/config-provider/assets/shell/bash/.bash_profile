# --------------------------------- FUNCTIONS -------------------------------- #

any-path-exists () {
  for path in "$@"; do
    if [ -e "$path" ]; then
      return 0
    fi
  done
  return 1
}

any-path-exists-parent () {
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

nr-agent () {
  if any-path-exists-parent package.json; then
    if [ -x "$(command -v nr)" ]; then
      nr -- "$@"
    else
      echo "Warning: \`@antfu/ni\` is not installed as a global node package."
    fi
  fi
}

# ------------------------------------ ENV ----------------------------------- #

# LANGUAGE & ENCODING
# Setting the language to English and the encoding to UTF-8.
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# $PATH
# >> Setting up fnm
eval "$(fnm env --use-on-cd --corepack-enabled --shell bash)"
# >> Add current node_modules/.bin to PATH if this is a npm project, so we can run npm scripts without `npx`.
# NOTICE: Just effect on the first time you start a new shell
if any-path-exists-parent package.json; then
  export PATH="$PWD/node_modules/.bin:$PATH"
fi

# UI
eval "$(oh-my-posh init bash --config "${POSH_THEMES_PATH}the-unnamed.omp.json")"

# COMMAND SHORTCUTS
# dev, test, build, start, release, lint, typecheck:
# Run npm scripts quickly while we are in a directory that has a `package.json`.
alias dev='nr-agent dev'
alias test='nr-agent test'
alias build='nr-agent build'
alias start='nr-agent start'
alias release='nr-agent release'
alias lint='nr-agent lint'
alias typecheck='nr-agent typecheck'
