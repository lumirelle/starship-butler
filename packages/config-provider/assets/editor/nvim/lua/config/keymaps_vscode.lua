-- Keymaps for Neovim when running inside VSCode

local map = vim.keymap.set
local vscode = require("vscode")

-- Use VSCode's undo/redo, as Neovim's undo break-points does not work correctly in VSCode
map("n", "u", function()
  vscode.action("undo")
  vscode.action("cancelSelection")
end, { desc = "Undo" })
map("n", "<C-r>", function()
  vscode.action("redo")
  vscode.action("cancelSelection")
end, { desc = "Redo" })

-- Use VSCode's fold/unfold, as Neovim's fold commands do not work in VSCode
-- It's sad that `gj` and `gk` do not work with vscode's folding
-- `zm` and `zr` are also not supported
map("n", "za", function()
  vscode.action("editor.toggleFold")
end, { desc = "Toggle Fold" })
map("n", "zA", function()
  vscode.action("editor.toggleFoldRecursively")
end, { desc = "Toggle Fold Recursively" })
map("n", "zM", function()
  vscode.action("editor.foldAll")
end, { desc = "Fold All" })
map("n", "zR", function()
  vscode.action("editor.unfoldAll")
end, { desc = "Unfold All" })

-- Resize window using <ctrl> arrow keys
map("n", "<C-Up>", "<C-w>+", { desc = "Increase window height", remap = true })
map("n", "<C-Down>", "<C-w>-", { desc = "Decrease window height", remap = true })
map("n", "<C-Left>", "<C-w><", { desc = "Decrease window width", remap = true })
map("n", "<C-Right>", "<C-w>>", { desc = "Increase window width", remap = true })

-- Diagnostics
map("n", "]e", function()
  vscode.action("editor.action.marker.nextInFiles")
end, { desc = "Go to Next Problem" })
map("n", "[e", function()
  vscode.action("editor.action.marker.prevInFiles")
end, { desc = "Go to Previous Problem" })

-- plugin: extras/editor/refactoring.lua implementation in vscode
map({ "n", "x" }, "<leader>r", function()
  vscode.with_insert(function()
    vscode.action("editor.action.rename")
  end)
end, { desc = "Rename Symbol" })

-- plugin: ../plugins/vscode_multi_cursor.lua implementation in vscode
-- I don't know why when I set these keymaps in the plugin keys option,
-- it will prevent the default keymaps from being disabled.
-- Create/cancel multiple cursors
map({ "n", "x" }, "<leader>mc", require("vscode-multi-cursor").create_cursor, { expr = true, desc = "Create Cursor" })
map("x", "I", require("vscode-multi-cursor").start_left_edge, { desc = "Start cursors on the left edge" })
map("x", "A", require("vscode-multi-cursor").start_right, { desc = "Start cursors on the right edge" })
map("n", "<leader>mx", require("vscode-multi-cursor").cancel, { desc = "Cancel/Clear all Cursors" })
-- Start editing
map({ "n", "x" }, "<leader>mi", require("vscode-multi-cursor").start_left, { desc = "Start cursors on the left" })
map("n", "<leader>mI", require("vscode-multi-cursor").start_left_edge, { desc = "Start cursors on the left edge" })
map({ "n", "x" }, "<leader>ma", require("vscode-multi-cursor").start_right, { desc = "Start cursors on the right" })
map("n", "<leader>mA", require("vscode-multi-cursor").start_right, { desc = "Start cursors on the right edge" })
-- Navigate between cursors
map({ "n", "x" }, "<leader>mh", require("vscode-multi-cursor").prev_cursor, { desc = "Goto previous cursor" })
map({ "n", "x" }, "<leader>ml", require("vscode-multi-cursor").next_cursor, { desc = "Goto next cursor" })
-- Using flash
map({ "n", "x" }, "<leader>mcs", require("vscode-multi-cursor").flash_char, { desc = "Create cursor using flash" })
map({ "n", "x" }, "<leader>mcw", require("vscode-multi-cursor").flash_word, { desc = "Create selection using flash" })
-- Add selection to next find match (like pressing Ctrl+D in VSCode)
map({ "n", "x", "i" }, "<C-n>", require("vscode-multi-cursor").addSelectionToNextFindMatch, { desc = "Add Selection To Next Find Match" })
