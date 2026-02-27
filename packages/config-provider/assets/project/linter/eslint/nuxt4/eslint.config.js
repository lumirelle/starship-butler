// @ts-check
import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'
import nuxt from './.nuxt/eslint.config.mjs'

export default antfu(
  {
    // Use `oxfmt`
    stylistic: false,
    unocss: true,
  },
  /**
   * Don't forget to set `standalone: false` in your Nuxt ESLint module options.
   */
  nuxt(),
  ...oxlint.configs['flat/recommended'],
)
