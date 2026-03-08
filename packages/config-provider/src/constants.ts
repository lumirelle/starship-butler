import { join } from 'pathe'

export const PKG_ROOT: string = import.meta.dirname.includes('shared')
  ? join(import.meta.dirname, '..', '..')
  : join(import.meta.dirname, '..')

export const ASSETS_FOLDER: string = join(PKG_ROOT, 'assets')
