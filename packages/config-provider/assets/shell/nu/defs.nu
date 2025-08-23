# Check if any path exists in the current directory.
export def any-path-exists [] {
  $in | any {|el| $el | path exists}
}

# Check if any path exists in the current directory or any of its parent directories.
export def any-path-exists-parent [] {
  for $path in $in {
    let $abs = $path | path expand
    let $level = $abs | path split | length
    for $i in (seq 0 $level) {
      let $dir = $abs | path split | drop $i | path join
      let $new_path = $dir | path join $path
      if ($new_path | path exists) {
        return true
      }
    }
  }
  false
}

# Check if all paths exist in the current directory.
export def all-path-exists [] {
  $in | all {|el| $el | path exists}
}

# Check if all paths exist in the current directory or any of its parent directories.
export def all-path-exists-parent [] {
  for $path in $in {
    let $abs = $path | path expand
    let $level = $abs | path split | length
    for $i in (seq 0 $level) {
      let $dir = $abs | path split | drop $i | path join
      let $new_path = $dir | path join $path
      if not ($new_path | path exists) {
        return false
      }
    }
  }
  true
}

# Agent for `@antfu/ni`
export def --wrapped nr-agent [...rest] {
  if (['package.json'] | any-path-exists-parent) {
    if (which nr | is-empty) {
      echo $'(ansi y)Warning: `@antfu/ni` is not installed as a global node package.(ansi reset)'
    } else {
      nr ...$rest
    }
  }
}
