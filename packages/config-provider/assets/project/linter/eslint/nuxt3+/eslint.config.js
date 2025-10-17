// Uncomment the comment below to enable type checking and linting when using this config
// // @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default antfu({
  formatters: true,
  unocss: true,
  pnpm: true,
})
  .append({
    name: 'lumirelle/javascript/rules',
    rules: {
      // RECOMMENDED:
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    },
  })
  /**
   * Don't forget to set `standalone: false` in your Nuxt ESLint module options.
   */
  .append(nuxt())
