// Uncomment the comment below to enable type checking and linting when using this config
// // @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

/**
 * Based on antfu's eslint config.
 */
export default antfu(
  /**
   * The options for generating the ESLint configurations
   */
  {
    /**
     * Enable formatters for css, markdown and etc. (requires `eslint-plugin-format`). If you are using `stylelint`, you
     * can set this property to a object with `css` property set to `false`.
     */
    formatters: true,

    /**
     * If you don't like some of the opinions provided by `@antfu/eslint-config`, such as `antfu/top-level-function`,
     * and `antfu/if-newline`. You can disable it by setting this option to `true`.
     */
    lessOpinionated: false,

    /**
     * UnoCSS support, enable it if you are using UnoCSS in this project.
     */
    unocss: false,

    /**
     * PNPM support, enable it if you are using PNPM as package manager.
     */
    pnpm: false,

    /**
     * Custom ignore patterns.
     */
    ignores: [
      // Add your custom ignore patterns here
    ],
  },
)
  /**
   * Prepend custom rules below
   */
  .prepend({
    name: 'lumirelle/javascript/setup',
    languageOptions: {
      globals: {
        // Add your custom global variables here
      },
    },
  })
  .insertAfter('lumirelle/javascript/setup', {
    name: 'lumirelle/javascript/rules',
    rules: {
      // RECOMMENDED:
      /**
       * We need to use `console` in development environment, we can use build plugin to remove it in production environment
       */
      'no-console': 'off',
    },
  })
  .insertAfter('lumirelle/javascript/rules', {
    name: 'lumirelle/regexp/rules',
    rules: {
      // RECOMMENDED:
      /**
       * A large number of none-capturing groups are less readable than the same number of capturing groups. Tell the
       * truth, it's not so necessary to use none-capturing groups in most cases. Unless performance is sensitive or
       * there are a large number of redundant captures, readability is more important. When working in teams,
       * readability is more critical than which grouping you choose.
       */
      'regexp/no-unused-capturing-group': 'off',
    },
  })
  /**
   * Append Nuxt specific rules and settings.
   */
  .append(nuxt())
