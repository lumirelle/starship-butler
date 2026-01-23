import { styleText } from 'node:util'

export function info(v: string): string {
  return styleText(['cyan'], v)
}

export function important(v: string): string {
  return styleText(['bold', 'magenta'], v)
}

export function success(v: string): string {
  return styleText(['green'], v)
}
