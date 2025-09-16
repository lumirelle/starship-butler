// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  /**
   * If you are using this config for a library, set it to 'lib'. This will enable more strict rules.
   * @default 'app'
   */
  type: 'lib',

  /**
   * Using prettier to format styles, html and markdown, requires `eslint-plugin-formatter`
   */
  formatters: true,

  /**
   * PNPM support, enable it if you are using PNPM as package manager.
   */
  pnpm: false,
})
