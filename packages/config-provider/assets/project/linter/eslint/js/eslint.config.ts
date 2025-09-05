import antfu from '@antfu/eslint-config'

export default antfu({
  // If you are using pnpm workspace, you can set pnpm to true
  // pnpm: true,
  // Using prettier to format styles, html and markdown, requires `eslint-plugin-formatter`
  formatters: true,
})
