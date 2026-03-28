-- Keymaps for Neovim when running inside VSCode

local map = vim.keymap.set
local vscode = require("vscode")

-- Better up and down in normal mode, align with LazyVim's default
--
-- This does not applicable to visual mode, as it will break visual selection
map("n", "j", function()
  if vim.v.count == 0 then
    vscode.call("cursorMove", { args = { to = "down", by = "wrappedLine", value = 1 } })
  else
    return "j"
  end
end, { silent = true, expr = true })
map("n", "k", function()
  if vim.v.count == 0 then
    vscode.call("cursorMove", { args = { to = "up", by = "wrappedLine", value = 1 } })
  else
    return "k"
  end
end, { silent = true, expr = true })
map("n", "<down>", function()
  if vim.v.count == 0 then
    vscode.call("cursorMove", { args = { to = "down", by = "wrappedLine", value = 1 } })
  else
    return "j"
  end
end, { silent = true, expr = true })
map("n", "<up>", function()
  if vim.v.count == 0 then
    vscode.call("cursorMove", { args = { to = "up", by = "wrappedLine", value = 1 } })
  else
    return "k"
  end
end, { silent = true, expr = true })

-- Use VSCode's fold/unfold, as Neovim's fold commands do not work in VSCode,
-- `zm` and `zr` are not supported by VSCode.
--
-- It's sad that `gj` and `gk` in Neovim do not work with vscode's folding, and we cannot use
-- VSCode's move to implement them, because they will break multi-cursor feature.
map({ "n", "x" }, "zc", function()
  vscode.action("editor.fold")
end, { desc = "Fold" })
map({ "n", "x" }, "zC", function()
  vscode.action("editor.foldRecursively")
end, { desc = "Fold Recursively" })
map({ "n", "x" }, "zo", function()
  vscode.action("editor.unfold")
end, { desc = "Unfold" })
map({ "n", "x" }, "zO", function()
  vscode.action("editor.unfoldRecursively")
end, { desc = "Unfold Recursively" })
map({ "n", "x" }, "za", function()
  vscode.action("editor.toggleFold")
end, { desc = "Toggle Fold" })
map({ "n", "x" }, "zA", function()
  vscode.action("editor.toggleFoldRecursively")
end, { desc = "Toggle Fold Recursively" })
map({ "n", "x" }, "zM", function()
  vscode.action("editor.foldAll")
end, { desc = "Fold All" })
map({ "n", "x" }, "zR", function()
  vscode.action("editor.unfoldAll")
end, { desc = "Unfold All" })

-- Goto
map({ "n", "x" }, "gf", "<nop>", { noremap = true })
map({ "n", "x" }, "gF", "<nop>", { noremap = true })
map({ "n", "x" }, "gh", "<nop>", { noremap = true })
map({ "n", "x" }, "gH", "<nop>", { noremap = true })
map({ "n", "x" }, "gr", function()
  vscode.action("editor.action.referenceSearch.trigger")
end, { noremap = true })

-- Diagnostics
map("n", "]d", function()
  vscode.action("editor.action.marker.next")
end, { desc = "Go to Next Problem" })
map("n", "[d", function()
  vscode.action("editor.action.marker.prev")
end, { desc = "Go to Previous Problem" })
map("n", "<leader>xq", function()
  vscode.action("editor.action.quickFix")
end, { desc = "Quickfix List" })

-- Quit
map("n", "<leader>qq", function()
  vscode.action("workbench.action.closeWindow")
end, { desc = "Close Window" })

-- plugin: extras/editor/refactoring.lua implementation in vscode
map({ "n", "x" }, "<leader>r", function()
  vscode.with_insert(function()
    vscode.action("editor.action.rename")
  end)
end, { desc = "Rename Symbol" })

-- plugin: ../plugins/vscode_multi_cursor.lua keymaps
-- I don't know why setting these keymaps in the plugin keys option,
-- it will prevent the default keymaps from being disabled.
-- Create/cancel multiple cursors
map({ "n", "x" }, "<leader>mc", require("vscode-multi-cursor").create_cursor, { expr = true, desc = "Create Cursor" })
map("n", "<leader>mx", require("vscode-multi-cursor").cancel, { desc = "Cancel/Clear all Cursors" })
-- Start editing
map("x", "I", require("vscode-multi-cursor").start_left_edge, { desc = "Start cursors on the left edge" })
map("x", "A", require("vscode-multi-cursor").start_right, { desc = "Start cursors on the right edge" })
-- Navigate between cursors
map({ "n", "x" }, "<leader>mh", require("vscode-multi-cursor").prev_cursor, { desc = "Goto previous cursor" })
map({ "n", "x" }, "<leader>ml", require("vscode-multi-cursor").next_cursor, { desc = "Goto next cursor" })
-- Add selection & create cursor to next find match
map({ "n", "x", "i" }, "<C-n>", require("vscode-multi-cursor").addSelectionToNextFindMatch, { desc = "Add Selection To Next Find Match" })
-- Using flash
map({ "n", "x" }, "<leader>mcs", require("vscode-multi-cursor").flash_char, { desc = "Create cursor using flash" })
map({ "n", "x" }, "<leader>mcw", require("vscode-multi-cursor").flash_word, { desc = "Create selection using flash" })
