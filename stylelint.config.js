import lumirelle from '@lumirelle/stylelint-config'

export default lumirelle({
  scss: true,
  vue: true,
})
  .override({
    files: ['**/*.css', '**/*.scss'],
    rules: {
      'media-feature-range-notation': null,
    },
  })
