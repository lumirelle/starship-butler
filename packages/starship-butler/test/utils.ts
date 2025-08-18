export function replacer(key: string, value: any): any {
  if (typeof value === 'function') {
    return `${value.toString()}`
      .replace(/\s+/g, ' ')
      .replace(/"/g, '\'')
  }
  return value
}

export function stringify(obj: any): string {
  return JSON.stringify(obj, replacer, 2)
}
