/* eslint perfectionist/sort-objects: "error" */
import type { KnipConfig } from 'knip'

export default {
  workspaces: {
    '.': {
      ignoreDependencies: ['starship-butler'],
    },
    docs: {
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
      ignoreBinaries: ['nu'],
      ignoreDependencies: ['@lumirelle/stylelint-config', 'taze'],
      ignoreFiles: ['assets/**/*'],
    },
    'packages/core': {
      ignoreFiles: ['test/fixture/butler.config*.ts'],
    },
    'packages/utils': {
      entry: ['src/*.ts'],
      ignoreFiles: ['bunup.config.*'],
    },
    playground: {
      ignoreDependencies: ['starship-butler'],
    },
  },
} satisfies KnipConfig
