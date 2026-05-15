import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/constants.ts', './src/command/*/index.ts'],
})
