import { join } from 'pathe'

export const PKG_ROOT = import.meta.dirname.includes('shared')
  ? join(import.meta.dirname, '..', '..')
  : join(import.meta.dirname, '..')

export const ASSETS_FOLDER = join(PKG_ROOT, 'assets')
