import { defineWorkspace } from 'bunup'

export default defineWorkspace([
  {
    name: 'core',
    root: 'packages/core',
  },
  {
    name: 'config-provider',
    root: 'packages/config-provider',
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
      /**
       * Disable code splitting due to Bun's current limitations with shared code among entrypoints.
       *
       * @see https://github.com/bunup/bunup/issues/93
       * @see https://github.com/oven-sh/bun/issues/5344
       */
      splitting: false,
    },
  },
])
