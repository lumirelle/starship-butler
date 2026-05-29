# Encoding
$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [Text.Encoding]::UTF8

# UI
Invoke-Expression (&starship init powershell)

# Environment Variables
## Mise, https://mise.jdx.dev/
(&mise activate pwsh) | Out-String | Invoke-Expression
## Podman
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
