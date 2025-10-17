// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  pnpm: true,
})
  .append({
    name: 'lumirelle/javascript/rules',
    rules: {
      // RECOMMENDED:
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    },
  })
