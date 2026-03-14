import type { KnipConfig } from 'knip'

export default {
  workspaces: {
    '.': {
      /// keep-sorted
      ignoreDependencies: ['@arethetypeswrong/cli', 'publint', /^starship-butler/],
      ignoreFiles: ['bunup.config.ts'],
    },
    'docs': {
      /// keep-sorted
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
      /// keep-sorted
      entry: ['src/command/*/index.ts', 'src/index.ts'],
      /// keep-sorted
      ignoreBinaries: ['nu'],
      /// keep-sorted
      ignoreFiles: ['assets/**/*'],
    },
    'packages/core': {
      /// keep-sorted
      ignoreFiles: ['test/fixture/butler.config*.ts'],
    },
    'packages/utils': {
      /// keep-sorted
      entry: ['src/*.ts'],
    },
  },
} satisfies KnipConfig
