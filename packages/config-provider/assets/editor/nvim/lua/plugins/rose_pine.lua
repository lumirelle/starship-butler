return {
  "rose-pine/neovim",
  name = "rose-pine",
  cond = not vim.g.vscode,
  config = function()
    vim.cmd("colorscheme rose-pine")
  end
}
