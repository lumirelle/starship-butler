/* eslint perfectionist/sort-objects: "error" */
import type { KnipConfig } from 'knip'

export default {
  workspaces: {
    '.': {
      ignoreDependencies: ['starship-butler', '@arethetypeswrong/cli', 'publint'],
      ignoreFiles: ['bunup.config.ts'],
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
      entry: ['src/index.ts', 'src/command/*/index.ts'],
      ignoreBinaries: ['nu'],
      ignoreDependencies: ['@lumirelle/stylelint-config', 'taze'],
      ignoreFiles: ['assets/**/*'],
    },
    'packages/core': {
      ignoreFiles: ['test/fixture/butler.config*.ts'],
    },
    'packages/utils': {
      entry: ['src/*.ts'],
    },
    playground: {
      ignoreDependencies: ['starship-butler'],
    },
  },
} satisfies KnipConfig
