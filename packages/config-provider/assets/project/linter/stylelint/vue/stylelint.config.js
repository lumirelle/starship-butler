/** @type {import('stylelint').Config} */
export default {
  extends: [
    /**
     * Stylistic
     */
    '@stylistic/stylelint-config',
    /**
     * Language-specific (SCSS & Vue & HTML)
     */
    'stylelint-config-standard-scss',
    'stylelint-config-standard-vue/scss',
    'stylelint-config-html/html',
    /**
     * Order of css properties
     */
    'stylelint-config-recess-order',
  ],

  allowEmptyInput: true,

  ignoreFiles: [
    /**
     * Build output
     */
    '{,src/,app/}{.nuxt,.output,dist}/**/*',
    /**
     * Node modules
     */
    '**/node_modules/**/*',
    // Add your custom ignore files here
  ],

  rules: {
    /* ---------------------- `@stylistic/stylelint-config` --------------------- */
    // RECOMMENDED:
    '@stylistic/max-line-length': null,

    /* ----------------------- `stylelint-config-standard` ---------------------- */
    // RECOMMENDED:
    'block-no-empty': [true, { severity: 'warning' }],
    'keyframes-name-pattern': null,
    'no-descending-specificity': null,
    'no-empty-source': null,
    'selector-class-pattern': null,
    'selector-id-pattern': null,

    /* -------------------- `stylelint-config-standard-scss` -------------------- */
    // RECOMMENDED:
    'scss/at-if-closing-brace-space-after': null,
    'scss/at-if-closing-brace-newline-after': null,
    'scss/at-else-closing-brace-newline-after': null,
    'scss/at-else-closing-brace-space-after': null,
    'scss/dollar-variable-pattern': null,
    /**
     * Enable for better dev experience, warning for it doesn't provide automatic fix.
     * @see https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/load-no-partial-leading-underscore
     */
    'scss/load-no-partial-leading-underscore': [true, { severity: 'warning' }],

    // SHAMELESSLY DISABLED:
    /**
     * You should use `%placeholder` to define the style should be reused and extend it instead of other selectors.
     * @see https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/at-extend-no-missing-placeholder
     */
    'scss/at-extend-no-missing-placeholder': [true, { severity: 'warning' }],

    // Add your custom rules here
  },
}
