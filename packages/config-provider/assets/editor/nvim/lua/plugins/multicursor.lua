return {
  {
    "jake-stewart/multicursor.nvim",
    branch = "1.0",
    cond = not vim.g.vscode,
    config = function()
        local mc = require("multicursor-nvim")
        mc.setup()
        local set = vim.keymap.set

        -- Create/cancel multiple cursors
        set({"n", "x"}, "<leader>mc", mc.addCursorOperator, { desc = "Create cursor"})
        set({"n"}, '<leader>mx', mc.clearCursors, { desc = "Cancel/Clear all cursors"})
        -- Start editing
        set("x", "I", mc.insertVisual)
        set("x", "A", mc.appendVisual)
        -- Navigate between cursors
        set({"n", "x"}, "<leader>mh", mc.prevCursor, { desc = "Goto previous cursor" })
        set({"n", "x"}, "<leader>ml", mc.nextCursor, { desc = "Goto next cursor" })
        -- Add selection & create cursor to the next find match
        set({"n", "x", "i"}, "<C-n>", function() mc.matchAddCursor(1) end, { desc = "Add Selection To Next Find Match" })

        -- VSCode-like experience
        -- Mouse support
        set("n", "<A-leftmouse>", mc.handleMouse)
        set("n", "<A-leftdrag>", mc.handleMouseDrag)
        set("n", "<A-leftrelease>", mc.handleMouseRelease)
        -- <Esc> to clear cursors
        mc.addKeymapLayer(function(layerSet)
          layerSet("n", "<esc>", function()
              if not mc.cursorsEnabled() then
                  mc.enableCursors()
              else
                  mc.clearCursors()
              end
          end)
        end)

        -- Customize how cursors look
        local hl = vim.api.nvim_set_hl
        hl(0, "MultiCursorCursor", { reverse = true })
        hl(0, "MultiCursorVisual", { link = "Visual" })
        hl(0, "MultiCursorSign", { link = "SignColumn"})
        hl(0, "MultiCursorMatchPreview", { link = "Search" })
        hl(0, "MultiCursorDisabledCursor", { reverse = true })
        hl(0, "MultiCursorDisabledVisual", { link = "Visual" })
        hl(0, "MultiCursorDisabledSign", { link = "SignColumn"})
    end
  }
}
