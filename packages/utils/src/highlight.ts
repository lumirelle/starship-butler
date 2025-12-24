import { bold, cyan, magenta } from 'ansis'

export { green, red, reset } from 'ansis'

export function info(v: unknown): string {
  return cyan(v)
}

export function important(v: unknown): string {
  return bold(magenta(v))
}
