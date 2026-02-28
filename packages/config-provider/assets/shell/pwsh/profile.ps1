# ----------------------------------- UTILS ---------------------------------- #

# Check if any path exists in the current directory.
function Test-AnyPathExists {
  foreach ($path in $args) {
    if (Test-Path -Path $path) {
      return $true
    }
  }
  return $false
}

# Check if any path exists in the current directory or any of its parent directories.
function Test-AnyPathExistsParent {
  foreach ($path in $args) {
    if (Test-Path -Path $path) {
      return $true
    }
    $absDirname = Split-Path (Join-Path -Path $pwd -ChildPath $path) -Parent
    $level = $absDirname.Split([System.IO.Path]::DirectorySeparatorChar) | Measure-Object | Select-Object -ExpandProperty Count
    for ($i = 0; $i -lt $level; $i++) {
      $dir = ($absDirname.Split([System.IO.Path]::DirectorySeparatorChar) | Select-Object -SkipLast $i) -Join [System.IO.Path]::DirectorySeparatorChar
      $newPath = Join-Path -Path $dir -ChildPath $path
      if (Test-Path -Path $newPath) {
        return $true
      }
    }
  }
  return $false
}

# Find out the dirname of the specified path both cwd & parent.
function Get-DirnameParent {
  $path = $args[0]
  $absDirname = Split-Path (Join-Path -Path $pwd -ChildPath $path) -Parent
  $level = $absDirname.Split([System.IO.Path]::DirectorySeparatorChar) | Measure-Object | Select-Object -ExpandProperty Count
  for ($i = 0; $i -lt $level; $i++) {
    $dir = ($absDirname.Split([System.IO.Path]::DirectorySeparatorChar) | Select-Object -SkipLast $i) -Join [System.IO.Path]::DirectorySeparatorChar
    $newPath = Join-Path -Path $dir -ChildPath $path
    if (Test-Path -Path $newPath) {
      return $dir
    }
  }
  return ''
}

# ------------------------------------ ENV ----------------------------------- #

# Encoding
$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [Text.Encoding]::UTF8

# UI
Invoke-Expression (&starship init powershell)

# Environment Variables
$env:PODMAN_COMPOSE_WARNING_LOGS = $false

# Commands Aliases
# `which`: Show the path of commands
New-Alias -Name which -Value where.exe
# `touch`: Create a file, using `touch` instead of `ni` (We use `ni` for `@antfu/ni`)
Remove-Item Alias:ni -Force -ErrorAction Ignore
New-Alias -Name touch -Value New-Item
# `grep`
New-Alias -Name grep -Value Select-String
# For container management
New-Alias -Name docker -Value podman
function Podman-Compose {
  podman compose @args
}
New-Alias -Name compose -Value Podman-Compose
