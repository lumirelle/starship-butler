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
   * If you are using pnpm workspace, you can set pnpm to true
   */
  // pnpm: true,
})
