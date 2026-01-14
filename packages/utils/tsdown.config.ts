import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/config.ts',
    './src/path.ts',
    './src/fs.ts',
    './src/highlight.ts',
    './src/consola.ts',
    './src/prompts.ts',
  ],
  dts: { build: true },
})
