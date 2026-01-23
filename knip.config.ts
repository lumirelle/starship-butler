import type { KnipConfig } from 'knip'

export default {
  workspaces: {
    '.': {
      // @keep-sorted
      ignoreDependencies: [
        'starship-butler',
      ],
    },
    'playground': {
      // @keep-sorted
      ignoreDependencies: [
        'starship-butler',
      ],
    },
    'packages/config-provider': {
      // @keep-sorted
      ignoreDependencies: [
        '@lumirelle/stylelint-config',
        'taze',
      ],
      // @keep-sorted
      ignoreBinaries: ['nu'],
      // @keep-sorted
      ignoreFiles: [
        'assets/**/*',
      ],
    },
    'packages/core': {
      // @keep-sorted
      ignoreFiles: [
        'test/fixture/butler.config*.ts',
      ],
    },
    'packages/utils': {
      // @keep-sorted
      ignoreFiles: [
        'bunup.config.*',
      ],
    },
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
  },
} as KnipConfig
