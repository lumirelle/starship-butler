import { defineConfig } from 'bunup'

export default defineConfig({
  entry: [
    './src/config.ts',
    './src/path.ts',
    './src/fs.ts',
    './src/highlight.ts',
    './src/consola.ts',
    './src/prompts.ts',
  ],
  /**
   * Disable code splitting due to Bun's current limitations with shared code among entrypoints.
   *
   * @see https://github.com/bunup/bunup/issues/93
   * @see https://github.com/oven-sh/bun/issues/5344
   */
  splitting: false,
}) as ReturnType<typeof defineConfig>
