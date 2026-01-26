// @ts-check
/* eslint perfectionist/sort-objects: "error" */
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  /**
   * Still requires `@vue/compiler-sfc@^3` as dev dependency
   */
  vue: {
    vueVersion: 2,
  },
})
