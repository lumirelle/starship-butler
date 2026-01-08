import type { KnipConfig } from 'knip'

export default {
  workspaces: {
    '.': {
      // @keep-sorted
      ignoreDependencies: [
        'bumpp',
        'lint-staged',
        'starship-butler',
        'taze',
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
} satisfies KnipConfig
