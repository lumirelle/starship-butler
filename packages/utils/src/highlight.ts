import { bold, cyan, green, magenta, red, reset } from 'ansis'

export const highlight = {
  green: (text: string) => {
    return green(text)
  },
  red: (text: string) => {
    return red(text)
  },
  info: (text: string) => {
    return cyan(text)
  },
  important: (text: string) => {
    return bold(magenta(text))
  },
  reset,
}
