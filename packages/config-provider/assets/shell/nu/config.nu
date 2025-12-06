use utils.nu *

# Banner
$env.config.show_banner = 'short'

# Editor
$env.config.buffer_editor = 'code'

# Hooks
$env.config.hooks.env_change.PWD = [
  # Add `<project-root>/node_modules/.bin` to `$env.Path` if we are in a node
  # project, so we can run scripts without anything (like `npx` or `bun`).
  {
    condition: {|| ['package.json'] | any-path-exists-parent}
    code: {||
      let $node_modules_path = 'node_modules' | path join '.bin'
      let $new_path = 'package.json' | dirname-parent | path join $node_modules_path
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
