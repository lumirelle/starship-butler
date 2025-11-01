function replacer(key: string, value: any): any {
  if (typeof value === 'function') {
    return `${value.toString()}`
      .replace(/\s+/g, ' ')
      .replace(/"/g, '\'')
  }
  return value
}

/**
 * Stringify an object to a JSON string with functions support.
 *
 * @param obj - The object to stringify.
 * @returns The JSON string.
 */
export function stringify(obj: any): string {
  return JSON.stringify(obj, replacer, 2)
}
