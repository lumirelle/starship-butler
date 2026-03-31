-- Options are automatically loaded before lazy.nvim startup
-- Default options that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/options.lua
-- Add any additional options here

local opt = vim.opt

opt.wrap = true
opt.guifont = { "Geist", "Maple Mono CN", "Symbols Nerd Font" }
opt.startofline = true

if vim.fn.executable("nu") == 1 then
  opt.shell = "nu"
end

-- Temporary fix before https://github.com/vscode-neovim/vscode-neovim/pull/2515 gets merged and released.
if vim.g.vscode then
  opt.cmdheight = 99999
end
