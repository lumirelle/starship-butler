-- Keymaps for Neovim when running outside VSCode

local map = vim.keymap.set

-- Edit
-- Add undo break-points
map("i", " ", " <C-g>u")
-- Code actions
-- Better code actions, align with VSCode's default
map({ "n", "x" }, "<C-.>", vim.lsp.buf.code_action, { desc = "Code Actions" })
-- Rename symbol
map({ "n", "x" }, "<leader>r", vim.lsp.buf.rename, { desc = "Rename Symbol" })
