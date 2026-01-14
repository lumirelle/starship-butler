// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default antfu({
  formatters: true,
  unocss: true,
})
  /**
   * Don't forget to set `standalone: false` in your Nuxt ESLint module options.
   */
  .append(nuxt())
