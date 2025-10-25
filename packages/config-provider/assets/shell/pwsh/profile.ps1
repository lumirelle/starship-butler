# --------------------------------- FUNCTIONS -------------------------------- #

function Test-AnyPathExists {
  foreach ($p in $args) {
    if (Test-Path -Path $p) {
      return $true
    }
  }
  return $false
}

function Test-AnyPathExistsParent {
  foreach ($p in $args) {
    $absDirname = Split-Path (Join-Path -Path $pwd -ChildPath $p) -Parent
    $level = $absDirname.Split([System.IO.Path]::DirectorySeparatorChar) | Measure-Object | Select-Object -ExpandProperty Count
    for ($i = 0; $i -lt $level; $i++) {
      $dir = ($absDirname.Split([System.IO.Path]::DirectorySeparatorChar) | Select-Object -SkipLast $i) -Join [System.IO.Path]::DirectorySeparatorChar
      $newPath = Join-Path -Path $dir -ChildPath $p
      if (Test-Path -Path $newPath) {
        return $true
      }
    }
  }
  return $false
}

function Get-DirnameParent {
  $p = $args[0]
  $absDirname = Split-Path (Join-Path -Path $pwd -ChildPath $p) -Parent
  $level = $absDirname.Split([System.IO.Path]::DirectorySeparatorChar) | Measure-Object | Select-Object -ExpandProperty Count
  for ($i = 0; $i -lt $level; $i++) {
    $dir = ($absDirname.Split([System.IO.Path]::DirectorySeparatorChar) | Select-Object -SkipLast $i) -Join [System.IO.Path]::DirectorySeparatorChar
    $newPath = Join-Path -Path $dir -ChildPath $p
    if (Test-Path -Path $newPath) {
      return $dir
    }
  }
  return ''
}

function Nr-Agent {
  if (Test-AnyPathExistsParent "package.json") {
    if (Get-Command -Name nr -ErrorAction SilentlyContinue) {
      nr @args
    } else {
      Write-Warning "Warning: `@antfu/ni` is not installed as a global node package."
    }
  }
}

# ------------------------------------ ENV ----------------------------------- #

# LANGUAGE & ENCODING
# Setting the encoding to UTF-8
$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [Text.Encoding]::UTF8

# $PATH
# >> Setting up fnm
fnm env --use-on-cd --corepack-enabled --shell powershell | Out-String | Invoke-Expression
# >> Add current node_modules/.bin to PATH if it exists, so we can run npm scripts without `npx`.
# NOTICE: Just effect on the first time you start a new shell
if (Test-AnyPathExistsParent "package.json") {
  $env:PATH = "{0}{1}node_modules{1}.bin;{2}" -f (Get-DirnameParent "package.json"), [System.IO.Path]::DirectorySeparatorChar, $env:PATH
}

# UI
Invoke-Expression (&starship init powershell)

# COMMAND ALIASES
# which: Show the path of commands
New-Alias -Name which -Value where.exe
# touch: Create a file, using `touch` instead of `ni` (We use `ni` for `@antfu/ni`)
Remove-Item Alias:ni -Force -ErrorAction Ignore
New-Alias -Name touch -Value New-Item
# grep
New-Alias -Name grep -Value Select-String

# COMMAND SHORTCUTS
# Run npm scripts quickly while we are in a directory that has a `package.json`
function Nr-Dev {
  Nr-Agent dev @args
}
function Nr-Play {
  Nr-Agent play @args
}
function Nr-Build {
  Nr-Agent build @args
}
function Nr-Start {
  Nr-Agent start @args
}
function Nr-Lint {
  Nr-Agent lint @args
}
function Nr-Test {
  Nr-Agent test @args
}
function Nr-Typecheck {
  Nr-Agent typecheck @args
}
function Nr-Docs {
  Nr-Agent docs @args
}
function Nr-Release {
  Nr-Agent release @args
}
New-Alias -Name dev -Value Nr-Dev
New-Alias -Name play -Value Nr-Play
New-Alias -Name build -Value Nr-Build
Remove-Item Alias:start -Force -ErrorAction Ignore
New-Alias -Name start -Value Nr-Start
New-Alias -Name lint -Value Nr-Lint
New-Alias -Name test -Value Nr-Test
New-Alias -Name typecheck -Value Nr-Typecheck
New-Alias -Name docs -Value Nr-Docs
New-Alias -Name release -Value Nr-Release

