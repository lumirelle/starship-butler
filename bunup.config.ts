import { defineWorkspace } from 'bunup'
import { isWindows } from 'std-env'

export default defineWorkspace([
  {
    name: 'core',
    root: 'packages/core',
  },
  {
    name: 'config-provider',
    root: 'packages/config-provider',
    config: {
      entry: ['./src/index.ts', './src/constants.ts', './src/command/*/index.ts'],
      // FIXME(Lumirelle): Bun has a bug with inlined dev dependencies in Windows, see
      // possible related issue https://github.com/oven-sh/bun/issues/26798
      packages: isWindows ? 'external' : undefined,
    },
  },
  {
    name: 'types',
    root: 'packages/types',
  },
  {
    name: 'utils',
    root: 'packages/utils',
    config: {
      entry: ['./src/config.ts', './src/path.ts', './src/fs.ts', './src/highlight.ts'],
    },
  },
])
