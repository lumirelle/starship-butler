// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  /**
   * Still requires `@vue/compiler-sfc@^3` as dev dependency
   */
  vue: {
    vueVersion: 2,
  },
  unocss: true,
})
