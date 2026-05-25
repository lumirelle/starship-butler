import { basename } from 'pathe'

/**
 * Remove the leading underscores from an asset filename (basename).
 *
 * @example
 * normalizeAssetFilename('_eslint.config.js') // 'eslint.config.js'
 * normalizeAssetFilename('C:\\Users\\_xxx\\_eslint.config.js') // 'C:\\Users\\_xxx\\eslint.config.js'
 */
export function normalizeAssetFilename(filename: string): string {
  const base = basename(filename)
  const normBase = base.replace(/^_+/, '')
  return filename.replace(base, normBase)
}
