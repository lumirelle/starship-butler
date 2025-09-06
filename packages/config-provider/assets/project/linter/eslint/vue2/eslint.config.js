import antfu from '@antfu/eslint-config'

export default antfu(
  // The options for generating the ESLint configurations
  {
    // Set vue version to 2
    // Requires `@vue/compiler-sfc@^3` as dev dependency
    vue: {
      vueVersion: 2,
    },

    // Disable typescript support, only enable it when this project uses typescript itself.
    // this option is auto-enabled if there is `typescript` package under your node_modules.
    // That means if you install dependencies by NPM or PNPM with `shamfully-hoist: true`, TypeScript plugin will be enabled.
    // If this project is a pure JavaScript project (lack of type support), when you use undefined variables, you won't get any error.
    // That's very dangerous.
    typescript: false,

    // Enable formatters for css, markdown and etc. (requires `eslint-plugin-format`)
    // If you are using `stylelint`, you can set this property to a object with `css` property set to `false`
    formatters: true,

    // `.eslintignore` is no longer supported in flat config, use `ignores` option instead
    // Build output, node_modules and other common ignored files are already included
    ignores: [
      // Assets and static files
      '{,src/,app/}assets/font{,s}',
      '{,src/,app/}assets/icon{,s}',
      '{,src/,app/}assets/image{,s}',
      '{,src/,app/}assets/lang{,s}',
      '{,src/,app/}assets/json{,s}',
      '{,src/,app/}static',
      '{,src/,app/}public',
      '{,src/,app/}theme',
      // Nuxt html templates
      'app/view',
      'app.html',
      // Add your custom ignored files here
    ],
  },
)
  // NOTE: Custom (override) rules of `@antfu/config` below
  .override('antfu/javascript/rules', {
    rules: {
      // We need to use `console` in development environment, we can use build plugin to remove it in production environment
      'no-console': 'off',
    },
  })
  .override('antfu/regexp/rules', {
    rules: {
      // A large number of none-capturing groups are less readable than the same number of capturing groups
      // Tell the true, it's not so necessary to use none-capturing groups in most cases
      // Unless performance is sensitive or there are a large number of redundant captures, readability is more important
      // When working in teams, readability is more critical than which grouping you choose
      'regexp/no-unused-capturing-group': 'off',
    },
  })
  .override('antfu/vue/rules', {
    rules: {
      // Enforce that properties used in templates are defined in the component
      'vue/no-undef-properties': 'error',
    },
  })
  // FIXME: Need to prove (I'm not sure if these are caused by the different of browser env & node env, or the different of webpack4 & webpack5 (or vite))
  .override('antfu/node/rules', {
    rules: {
      // Use global variable `process` instead of import it explicitly such as `import process from 'process'`
      'node/prefer-global/process': 'off',
    },
  })
  .override('antfu/unicorn/rules', {
    rules: {
      // Use `path` instead of `node:path`
      'unicorn/prefer-node-protocol': 'off',
    },
  })
  // FIXME: Compatible with old project, these rules are not providing auto-fix operation, please reactive these rules progressively
  .override('antfu/javascript/rules', {
    rules: {
      'eqeqeq': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'no-irregular-whitespace': 'warn',
      'prefer-rest-params': 'warn',
    },
  })
  .override('antfu/vue/rules', {
    rules: {
      'vue/eqeqeq': 'warn',
      // Vue 2 recommends kebab-case for custom event names
      'vue/custom-event-name-casing': ['warn', 'kebab-case'],
      'vue/no-reserved-component-names': 'warn',
      'vue/no-unused-refs': 'warn',
      // You'd better not mutating props directly, it will break the unidirectional data flow
      // However, humans always tend to be lazy, wish they will not be debugging in hell in the future
      'vue/no-mutating-props': 'warn',
    },
  })
  // NOTE: Append custom rules below
  .append({
    name: 'lumirelle/setup',
    languageOptions: {
      globals: {
        // Add your custom global variables here
      },
    },
  })
