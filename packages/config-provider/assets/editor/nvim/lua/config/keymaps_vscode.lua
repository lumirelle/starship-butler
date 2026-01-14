-- Keymaps for Neovim when running inside VSCode

local map = vim.keymap.set
local vscode = require("vscode")

-- Use VSCode's cursor move to handle wrapped lines correctly (compatible with fold/unfold)
map({ "n", "x" }, "j", function()
  vscode.action("cursorMove", {
    args = {
      to = "down",
      by = vim.v.count == 0 and "wrappedLine" or "line",
      value = vim.v.count1,
    }
  })
end, { desc = "Down", silent = true })
map("v", "j", function()
  vscode.action("cursorMove", {
    args = {
      to = "down",
      by = vim.v.count == 0 and "wrappedLine" or "line",
      value = vim.v.count1,
      select = true,
    }
  })
end, { desc = "Down", silent = true })
map({ "n", "x" }, "<Down>", function()
  vscode.action("cursorMove", {
    args = {
      to = "down",
      by = vim.v.count == 0 and "wrappedLine" or "line",
      value = vim.v.count1,
    }
  })
end, { desc = "Down", silent = true })
map("v", "<Down>", function()
  vscode.action("cursorMove", {
    args = {
      to = "down",
      by = vim.v.count == 0 and "wrappedLine" or "line",
      value = vim.v.count1,
      select = true,
    }
  })
end, { desc = "Down", silent = true })
map({ "n", "x" }, "k", function()
  vscode.action("cursorMove", {
    args = {
      to = "up",
      by = vim.v.count == 0 and "wrappedLine" or "line",
      value = vim.v.count1,
    }
  })
end, { desc = "Up", silent = true })
map("v", "k", function()
  vscode.action("cursorMove", {
    args = {
      to = "up",
      by = vim.v.count == 0 and "wrappedLine" or "line",
      value = vim.v.count1,
      select = true,
    }
  })
end, { desc = "Up", silent = true })
map({ "n", "x" }, "<Up>", function()
  vscode.action("cursorMove", {
    args = {
      to = "up",
      by = vim.v.count == 0 and "wrappedLine" or "line",
      value = vim.v.count1,
    }
  })
end, { desc = "Up", silent = true })
map("v", "<Up>", function()
  vscode.action("cursorMove", {
    args = {
      to = "up",
      by = vim.v.count == 0 and "wrappedLine" or "line",
      value = vim.v.count1,
      select = true,
    }
  })
end, { desc = "Up", silent = true })

-- Use VSCode's undo/redo, as Neovim's undo break-points does not work correctly in VSCode
map("n", "u", function()
  vscode.action("undo")
  vscode.action("cancelSelection")
end, { desc = "Undo" })
map("n", "<C-r>", function()
  vscode.action("redo")
  vscode.action("cancelSelection")
end, { desc = "Redo" })

-- Use VSCode's toggle comment
map({ "n", "v" }, "gcc", function()
  vscode.action("editor.action.commentLine")
end, { desc = "toggle line comment" })

-- Use VSCode's fold/unfold
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

-- plugin: extras/editor/refactoring.lua for vscode
map({ "n", "x" }, "<leader>r", function()
  vscode.with_insert(function()
    vscode.action("editor.action.rename")
  end)
end, { desc = "Rename Symbol" })
