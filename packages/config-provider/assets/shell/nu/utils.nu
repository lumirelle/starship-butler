# ---------------------------------- Path ----------------------------------

# Check if any path exists in the current directory.
export def any-path-exists [] {
  $in | any {|el| $el | path exists}
}

# Check if any path exists in the current directory or any of its parent directories.
export def any-path-exists-parent [] {
  for $path in $in {
    let $abs_dirname = $path | path expand | path dirname
    let $dir_level = $abs_dirname | path split | length
    for $i in (seq 0 $dir_level) {
      let $dir = $abs_dirname | path split | drop $i | path join
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
    let $abs_dirname = $path | path expand | path dirname
    let $dir_level = $abs_dirname | path split | length
    for $i in (seq 0 $dir_level) {
      let $dir = $abs_dirname | path split | drop $i | path join
      let $new_path = $dir | path join $path
      if not ($new_path | path exists) {
        return false
      }
    }
  }
  true
}

# Find out the dirname of the specified path both cwd & parent.
export def dirname-parent [] {
  let $abs_dirname = $in | path expand | path dirname
  let $dir_level = $abs_dirname | path split | length
  for $i in (seq 0 $dir_level) {
    let $dir = $abs_dirname | path split | drop $i | path join
    let $new_path = $dir | path join $in
    if ($new_path | path exists) {
      return $dir
    }
  }
  ''
}

# ---------------------------------- Agent ----------------------------------

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
