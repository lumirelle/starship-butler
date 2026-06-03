import type { KnipConfig } from 'knip'

export default {
  workspaces: {
    '.': {
      entry: ['./scripts/**/*.{ts,js}', './test/**/*.{ts,js}'],
      ignoreBinaries: ['mise'],
      ignoreDependencies: [
        '@lumirelle/oxlint-config',
        'bumpp',
        'nano-staged',
      ],
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
      entry: ['./test/**/*.{ts,js}'],
      ignoreFiles: ['./assets/**/*'],
    },
    'packages/core': {
      entry: ['./test/**/*.{ts,js}'],
    },
    'packages/utils': {
      entry: ['./test/**/*.{ts,js}'],
    },
    'packages/types': {
    },
  },
} satisfies KnipConfig
