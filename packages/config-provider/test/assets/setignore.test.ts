import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { exists } from 'starship-butler-utils/fs'
import { join } from 'starship-butler-utils/path'

const ignoreFilePath = join(import.meta.dirname, '..', '..', 'assets', '.setignore')

describe('.setignore files', () => {
  it('should exists', () => {
    expect(exists(ignoreFilePath)).toBe(true)
  })

  it('should match snapshot', () => {
    const content = readFileSync(ignoreFilePath, 'utf-8')
    expect(content).toMatchInlineSnapshot(`
      "**/README.md
      **/.nuxt/eslint.config.*
      "
    `)
  })
})
