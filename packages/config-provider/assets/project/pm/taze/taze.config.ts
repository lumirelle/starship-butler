import { defineConfig } from 'taze'

export default defineConfig({
  interactive: true,
  recursive: true,
  write: true,
  peer: true,
}) as ReturnType<typeof defineConfig>
