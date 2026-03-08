import { defineWorkspace } from 'bunup'

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
