import type { KnipConfig } from 'knip'

export default {
  workspaces: {
    '.': {
      ignoreDependencies: ['@lumirelle/oxlint-config'],
    },
    'docs': {
      ignoreDependencies: [
        '@iconify-json/svg-spinners',
        '@unocss/reset',
        '@vueuse/core',
        'floating-vue',
        'pinia',
        'uno.css',
      ],
    },
    'packages/config-provider': {
      entry: ['./src/index.ts', './src/constants.ts', './src/command/*/index.ts'],
      ignoreBinaries: ['nu'],
      ignoreFiles: ['./assets/**/*'],
    },
    'packages/core': {
      ignoreFiles: ['./test/fixtures/butler.config*.ts'],
    },
    'packages/utils': {
      entry: ['./src/*.ts'],
    },
  },
} satisfies KnipConfig
