return {
  'projekt0n/github-nvim-theme',
  name = 'github-theme',
  cond = not vim.g.vscode,
  config = function()
    vim.cmd("colorscheme github_dark_default")
  end
}
