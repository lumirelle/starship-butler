// @ts-check
import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default antfu(
  {
    type: 'lib',
    stylistic: false,
    ignores: ['test/exports/**'],
  },
  ...oxlint.configs['flat/recommended'],
)
