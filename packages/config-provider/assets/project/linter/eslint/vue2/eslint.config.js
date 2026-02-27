// @ts-check
import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default antfu(
  {
    // Use `oxfmt`
    stylistic: false,
    unocss: true,
    /**
     * Still requires `@vue/compiler-sfc@^3` as dev dependency
     */
    vue: {
      vueVersion: 2,
    },
  },
  ...oxlint.configs['flat/recommended'],
)
