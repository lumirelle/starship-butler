-- Options are automatically loaded before lazy.nvim startup
-- Default options that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/options.lua
-- Add any additional options here

local opt = vim.opt

opt.wrap = true
opt.guifont = { "Maple Mono CN", "Symbols Nerd Font" }

if vim.fn.executable("nu") == 1 then
  opt.shell = "nu"
end
