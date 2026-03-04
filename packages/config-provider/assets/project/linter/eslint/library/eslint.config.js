// @ts-check
import { antfu } from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default antfu(
  {
    // Use `oxfmt`
    stylistic: false,
    type: 'lib',
  },
  ...oxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
)
  // If you are not using `bun`, you can remove this.
  .override('antfu/perfectionist/setup', {
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          environment: 'bun',
          groups: [
            'type-import',
            ['type-parent', 'type-sibling', 'type-index', 'type-internal'],
            'value-builtin',
            'value-external',
            'value-internal',
            ['value-parent', 'value-sibling', 'value-index'],
            'side-effect',
            'ts-equals-import',
            'unknown',
          ],
          newlinesBetween: 'ignore',
          newlinesInside: 'ignore',
          order: 'asc',
          type: 'natural',
        },
      ],
    },
  })
  .removeRules('unicorn/number-literal-case')
