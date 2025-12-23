local function create_lazy_augroup(name)
  return vim.api.nvim_create_augroup("lazyvim_" .. name, { clear = true })
end
local function del_lazy_augroup(name)
  vim.api.nvim_del_augroup_by_name("lazyvim_" .. name)
end

-- Remove LazyVim's default wrap_spell autocmds in VSCode environment
del_lazy_augroup("wrap_spell")

-- Workaround for vscode-neovim UI desync (issue https://github.com/vscode-neovim/vscode-neovim/issues/2117)
-- 1. Redraw on CursorHold (idle for some time)
vim.api.nvim_create_autocmd('CursorHold', {
  group = create_lazy_augroup('redraw_on_cursor_hold'),
  callback = function()
    vim.cmd('silent! mode')  -- triggers a lightweight redraw
  end,
})
-- 2. Redraw immediately after text changes (e.g., visual delete)
vim.api.nvim_create_autocmd({ "TextChanged", "TextChangedI" }, {
  group = create_lazy_augroup('redraw_on_text_changed'),
  callback = function()
    if vim.fn.mode() == 'n' then
      vim.cmd('silent! mode')  -- refresh UI after delete/insert
    end
  end,
})
