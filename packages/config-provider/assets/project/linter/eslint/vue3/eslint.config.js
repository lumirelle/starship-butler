// @ts-check
import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default antfu(
  {
    // Use `oxfmt`
    stylistic: false,
    unocss: true,
  },
  ...oxlint.configs['flat/recommended'],
)
