import { readFileSync } from 'node:fs'
import { join } from 'pathe'
import { exists } from 'starship-butler-utils/fs'
import { describe, expect, it } from 'vitest'

const ignoreFilePath = join(import.meta.dirname, '..', '..', 'assets', '.setignore')

describe('.setignore files', () => {
  it('should exists', () => {
    expect(exists(ignoreFilePath)).toBe(true)
  })

  it('should match inline snapshot', () => {
    const content = readFileSync(ignoreFilePath, 'utf8')
    expect(content).toMatchInlineSnapshot(`
      "**/README.md
      **/.nuxt/eslint.config.d.mts
      **/__internal__/**/*
      tsconfig.json
      "
    `)
  })
})
