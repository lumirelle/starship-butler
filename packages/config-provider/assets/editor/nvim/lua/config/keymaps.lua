-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

local map = vim.keymap.set
local unmap = vim.keymap.del

-- Add undo break-points
map("i", " ", " <C-g>u")

-- FIXME(Lumirelle): Not only quickfix list, actually code action list
map("n", "<C-.>", "<leader>xq", { desc = "Quickfix List", remap = true })

-- Keymaps for Neovim when running inside VSCode
if vim.g.vscode then
  require("config.keymaps_vscode")
end
