-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

local map = vim.keymap.set
local unmap = vim.keymap.del

-- Add undo break-points
map("i", " ", " <C-g>u")

-- Keymaps for Neovim when running inside/outside VSCode
if vim.g.vscode then
  require("config.keymaps_vscode")
else
  require("config.keymaps_not_vscode")
end
