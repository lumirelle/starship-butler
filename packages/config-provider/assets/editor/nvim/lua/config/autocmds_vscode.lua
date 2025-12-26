local function del_lazy_augroup(name)
  vim.api.nvim_del_augroup_by_name("lazyvim_" .. name)
end

-- Remove LazyVim's default wrap_spell autocmds in VSCode environment
del_lazy_augroup("wrap_spell")
