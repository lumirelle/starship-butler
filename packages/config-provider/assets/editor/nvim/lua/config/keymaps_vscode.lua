-- Keymaps for Neovim when running inside VSCode

local map = vim.keymap.set
local vscode = require("vscode")
local vscode_neovim = require("vscode-neovim")

-- Better up/down
map("n", "j", function()
  vscode_neovim.action("cursorMove", {
    args = {
      to = "down",
      by = "wrappedLine",
      value = vim.v.count1,
    }
  })
end, { desc = "Down", silent = true })
map("n", "<Down>", function()
  vscode_neovim.action("cursorMove", {
    args = {
      to = "down",
      by = "wrappedLine",
      value = vim.v.count1,
    }
  })
end, { desc = "Down", silent = true })
map("n", "k", function()
  vscode_neovim.action("cursorMove", {
    args = {
      to = "up",
      by = "wrappedLine",
      value = vim.v.count1,
    }
  })
end, { desc = "Up", silent = true })
map("n", "<Up>", function()
  vscode_neovim.action("cursorMove", {
    args = {
      to = "up",
      by = "wrappedLine",
      value = vim.v.count1,
    }
  })
end, { desc = "Up", silent = true })

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
