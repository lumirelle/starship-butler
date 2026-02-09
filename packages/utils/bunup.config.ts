import type { defineConfig } from 'bunup'

export default {
  entry: [
    './src/config.ts',
    './src/path.ts',
    './src/fs.ts',
    './src/highlight.ts',
  ],
  /**
   * Disable code splitting due to Bun's current limitations with shared code among entrypoints.
   *
   * @see https://github.com/bunup/bunup/issues/93
   * @see https://github.com/oven-sh/bun/issues/5344
   */
  splitting: false,
} satisfies ReturnType<typeof defineConfig> as ReturnType<typeof defineConfig>
