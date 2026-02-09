import type { KnipConfig } from 'knip'

export default {
  // @keep-sorted
  workspaces: {
    // @keep-sorted
    '.': {
      // @keep-sorted
      ignoreDependencies: [
        'starship-butler',
      ],
    },
    // @keep-sorted
    'docs': {
      // @keep-sorted
      ignoreDependencies: [
        '@iconify-json/svg-spinners',
        '@unocss/reset',
        '@vueuse/core',
        'floating-vue',
        'pinia',
        'uno.css',
      ],
    },
    // @keep-sorted
    'packages/config-provider': {
      // @keep-sorted
      ignoreBinaries: ['nu'],
      // @keep-sorted
      ignoreDependencies: [
        '@lumirelle/stylelint-config',
        'taze',
      ],
      // @keep-sorted
      ignoreFiles: [
        'assets/**/*',
      ],
    },
    // @keep-sorted
    'packages/core': {
      // @keep-sorted
      ignoreFiles: [
        'test/fixture/butler.config*.ts',
      ],
    },
    // @keep-sorted
    'packages/utils': {
      entry: ['src/*.ts'],
      // @keep-sorted
      ignoreFiles: [
        'bunup.config.*',
      ],
    },
    // @keep-sorted
    'playground': {
      // @keep-sorted
      ignoreDependencies: [
        'starship-butler',
      ],
    },
  },
} satisfies KnipConfig as KnipConfig
