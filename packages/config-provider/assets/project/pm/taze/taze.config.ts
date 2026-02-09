import type { defineConfig } from 'taze'

export default {
  interactive: true,
  recursive: true,
  write: true,
  peer: true,
} satisfies ReturnType<typeof defineConfig> as ReturnType<typeof defineConfig>
