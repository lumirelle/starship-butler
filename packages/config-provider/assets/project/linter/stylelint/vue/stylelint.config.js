/** @type {import('stylelint').Config} */
export default {
  extends: [
    // Stylistic
    '@stylistic/stylelint-config',
    // Order of css properties
    'stylelint-config-recess-order',
    // Language-specific
    'stylelint-config-standard-scss',
    'stylelint-config-standard-vue/scss',
    // Set `postcss-html` as the custom syntax for all `.html` like files
    // `stylelint-config-standard-vue/scss` just set `post-html` as the custom syntax for `.vue` files
    'stylelint-config-html/vue',
  ],

  allowEmptyInput: true,

  ignoreFiles: [
    // Build output
    '{,src/,app/}.nuxt/**/*',
    '{,src/,app/}.output/**/*',
    '{,src/,app/}dist/**/*',
    // Assets and static files
    '{,src/app/}assets/font{,s}/**/*',
    '{,src/app/}assets/icon{,s}/**/*',
    '{,src/app/}assets/image{,s}/**/*',
    '{,src/app/}assets/lang{,s}/**/*',
    '{,src/app/}assets/json{,s}/**/*',
    '{,src/app/}static/**/*',
    '{,src/app/}public/**/*',
    '{,src/app/}theme/**/*',
    // Node modules
    '**/node_modules/**/*',
    // Nuxt app
    'app/view/**/*',
    'app.html',
    // NOTICE: Add your custom ignore files here
  ],

  rules: {
    // Stylistic rules
    '@stylistic/max-line-length': null,
    '@stylistic/block-closing-brace-newline-after': [
      'always',
      {
        ignoreAtRules: ['if', 'else'],
      },
    ],

    // Override rules of `stylelint-config-recommended`
    // We don't want to set a generic family in some cases, like when we use iconfont
    'font-family-no-missing-generic-family-keyword': null,
    // This rule does not works well with nested selector structure, we'd better maintain the order of selectors by ourselves
    'no-descending-specificity': null,
    // For better dev experience, they didn't provide automatic fix
    'no-empty-source': [true, { severity: 'warning' }],
    'block-no-empty': [true, { severity: 'warning' }],

    // Override rules of `stylelint-config-standard`
    // It's recommended to use BEM class & id selector pattern
    'selector-class-pattern': [
      '^(([a-z][a-z0-9]*)(-[a-z0-9]+)*)(__[a-z][a-z0-9]*(-[a-z0-9]+)*)?(--[a-z][a-z0-9]*(-[a-z0-9]+)*)?$',
      {
        message: selector => `Expected class selector "${selector}" to be BEM case`,
        severity: 'warning',
      },
    ],
    'selector-id-pattern': [
      '^(([a-z][a-z0-9]*)(-[a-z0-9]+)*)(__[a-z][a-z0-9]*(-[a-z0-9]+)*)?(--[a-z][a-z0-9]*(-[a-z0-9]+)*)?$',
      {
        message: selector => `Expected id selector "${selector}" to be BEM case`,
        severity: 'warning',
      },
    ],
    // It's recommended to use kebab-case for keyframe name
    'keyframes-name-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: name => `Expected keyframe name "${name}" to be kebab-case`,
        severity: 'warning',
      },
    ],
    // If you are not using `autoprefixer`, you should set it to false
    'property-no-vendor-prefix': true,

    // Override rules of `stylelint-config-recommended-scss`
    // You should use `%placeholder` to define the style should be reused and extend the `%placeholder` instead of other selector
    'scss/at-extend-no-missing-placeholder': [true, { severity: 'warning' }],
    // For better dev experience, it didn't provide automatic fix
    'scss/load-no-partial-leading-underscore': [true, { severity: 'warning' }],

    // Override rules of `stylelint-config-standard-scss`
    'scss/dollar-variable-pattern': [
      '^(-|--)?[a-z][a-z0-9]*(-[a-z0-9]+)*$',
      {
        message: 'Expected variable to be kebab-case, start with "-" or "--"',
      },
    ],
    // In my opinion, a rule about stylistic and doesn't provide auto-fix operation is of little value
    'scss/double-slash-comment-whitespace-inside': null,

    // Override rules of `stylelint-config-recommended-vue`
    // Support pseudo classes and elements provided by vue, webpack and element-ui
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['deep', 'global', 'slotted', 'export'] },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      { ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted', 'input-placeholder'] },
    ],

    // NOTICE: Add your custom rules here
  },
}
