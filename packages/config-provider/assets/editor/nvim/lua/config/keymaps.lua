-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

local map = vim.keymap.set

if vim.g.vscode then
  local vscode = require("vscode")

  -- Better up/down
  map("n", "j", function()
    require("vscode-neovim").action("cursorMove", {
      args = {
        to = "down",
        by = "wrappedLine",
        value = vim.v.count1,
      }
    })
  end, { desc = "Down", silent = true })
  map("n", "<Down>", function()
    require("vscode-neovim").action("cursorMove", {
      args = {
        to = "down",
        by = "wrappedLine",
        value = vim.v.count1,
      }
    })
  end, { desc = "Down", silent = true })
  map("n", "k", function()
    require("vscode-neovim").action("cursorMove", {
      args = {
        to = "up",
        by = "wrappedLine",
        value = vim.v.count1,
      }
    })
  end, { desc = "Up", silent = true })
  map("n", "<Up>", function()
    require("vscode-neovim").action("cursorMove", {
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

  -- nvim keymaps for vscode
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
end
