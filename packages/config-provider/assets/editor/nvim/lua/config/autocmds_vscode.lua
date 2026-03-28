local vscode = require("vscode")

-- Remove LazyVim's default wrap_spell autocmds in VSCode environment
local function del_lazy_augroup(name)
  vim.api.nvim_del_augroup_by_name("lazyvim_" .. name)
end
del_lazy_augroup("wrap_spell")
