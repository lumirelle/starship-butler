import { platform } from 'node:os'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: platform() === 'win32' ? 10000 : 5000,
  },
})
