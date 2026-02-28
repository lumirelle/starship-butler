# Check if any path exists in the current directory.
export def any-path-exists [] {
  $in | any {|path| $path | path exists}
}

# Check if any path exists in the current directory or any of its parent directories.
export def any-path-exists-parent [] {
  for $path in $in {
    if ($path | path exists) {
      return true
    }
    let $abs_dirname = $path | path expand | path dirname
    let $dir_level = $abs_dirname | path split | length
    for $i in (0..$dir_level) {
      let $dir = $abs_dirname | path split | drop $i | path join
      let $new_path = $dir | path join $path
      if ($new_path | path exists) {
        return true
      }
    }
  }
  return false
}

# Find out the dirname of the specified path both cwd & parent.
export def dirname-parent [] {
  let $path = $in
  let $abs_dirname = $path | path expand | path dirname
  let $dir_level = $abs_dirname | path split | length
  for $i in (0..$dir_level) {
    let $dir = $abs_dirname | path split | drop $i | path join
    let $new_path = $dir | path join $path
    if ($new_path | path exists) {
      return $dir
    }
  }
  return ''
}
