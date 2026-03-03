-- Keymaps for Neovim when running outside VSCode
local map = vim.keymap.set

map("n", "<C-.>", "<leader>xq", { desc = "Quickfix List" })
