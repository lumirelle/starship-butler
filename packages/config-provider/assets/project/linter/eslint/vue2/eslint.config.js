// @ts-check
import antfu from '@antfu/eslint-config'

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
     * Set vue version to 2, requires `@vue/compiler-sfc@^3` as dev dependency
     */
    vue: {
      vueVersion: 2,
    },

    /**
     * Disable typescript support, only enable it when this project uses typescript itself. This option is auto-enabled
     * if there is `typescript` package under your node_modules. That means if you install dependencies by NPM or PNPM
     * with `shamfully-hoist: true`, TypeScript plugin will be enabled. If this project is a pure JavaScript project
     * (lack of type support), when you use undefined variables, you won't get any error. That's very dangerous.
     */
    typescript: false,

    /**
     * If you don't like some of the opinions provided by `@antfu/eslint-config`, such as `antfu/top-level-function`,
     * and `antfu/if-newline`. You can disable it by setting this option to `true`.
     */
    lessOpinionated: false,

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

      // SHAMELESSLY DISABLED:
      'eqeqeq': 'warn',
      'no-irregular-whitespace': 'warn',
      'prefer-rest-params': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'warn',
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
  .insertAfter('lumirelle/regexp/rules', {
    name: 'lumirelle/node/rules',
    rules: {
      // RECOMMENDED:
      'node/no-missing-import': ['error', { tryExtensions: ['.js', '.json', '.node', '.ts', '.tsx', '.vue'] }],
      'node/no-missing-require': ['error', { tryExtensions: ['.js', '.json', '.node', '.ts', '.tsx', '.vue'] }],
    },
  })
  .insertAfter('lumirelle/node/rules', {
    name: 'lumirelle/vue/rules',
    files: ['**/*.vue'],
    rules: {
      // RECOMMENDED:
      /**
       * Enforce that properties used in templates are defined in the component
       */
      'vue/no-undef-properties': 'error',

      // SHAMELESSLY DISABLED:
      'vue/eqeqeq': 'warn',
      /**
       * Vue 3 recommends camelCase for custom event names
       */
      'vue/custom-event-name-casing': ['warn', 'camelCase'],
      'vue/no-reserved-component-names': 'warn',
      'vue/no-unused-refs': 'warn',
      /**
       * You'd better not mutating props directly, it will break the unidirectional data flow. However, humans always
       * tend to be lazy, wish they will not be debugging in hell in the future
       */
      'vue/no-mutating-props': 'warn',
    },
  })
  .insertAfter('lumirelle/node/rules', {
    name: 'lumirelle/import/rules',
    rules: {
      // RECOMMENDED:
      /**
       * Ensure imports point to files/modules that can be resolved. Not implemented in `eslint-plugin-import-lite` currently.
       * @see https://github.com/9romise/eslint-plugin-import-lite/issues/9
       */
      // 'import/named': 'error',
    },
  })
