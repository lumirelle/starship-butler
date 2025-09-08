export const defaultNamespace = 'cus'

const statePrefix = 'is-'

/**
 * Generate a bem class name by namespace, block, block suffix, element and modifier
 *
 * @private
 * @param block - The block to use
 * @param blockSuffix - The block suffix to use
 * @param element - The element to use
 * @param modifier - The modifier to use
 * @returns The bem class
 */
function _bem(block: string, blockSuffix: string, element: string, modifier: string): string {
  let cls = `${block}`
  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}

export interface UseNamespaceReturn {
  b: (blockSuffix?: string) => string
  e: (element?: string) => string
  m: (modifier?: string) => string
  be: (blockSuffix?: string, element?: string) => string
  em: (element?: string, modifier?: string) => string
  bm: (blockSuffix?: string, modifier?: string) => string
  bem: (blockSuffix?: string, element?: string, modifier?: string) => string
  is: {
    (name: string, state: boolean | undefined): string
    (name: string): string
  }
}

export function useNamespace(block: string): UseNamespaceReturn {
  const b = (blockSuffix = ''): string =>
    _bem(block, blockSuffix, '', '')
  const e = (element?: string): string =>
    element ? _bem(block, '', element, '') : ''
  const m = (modifier?: string): string =>
    modifier ? _bem(block, '', '', modifier) : ''
  const be = (blockSuffix?: string, element?: string): string =>
    blockSuffix && element
      ? _bem(block, blockSuffix, element, '')
      : ''
  const em = (element?: string, modifier?: string): string =>
    element && modifier
      ? _bem(block, '', element, modifier)
      : ''
  const bm = (blockSuffix?: string, modifier?: string): string =>
    blockSuffix && modifier
      ? _bem(block, blockSuffix, '', modifier)
      : ''
  const bem = (blockSuffix?: string, element?: string, modifier?: string): string =>
    blockSuffix && element && modifier
      ? _bem(block, blockSuffix, element, modifier)
      : ''
  const is: {
    (name: string, state: boolean | undefined): string
    (name: string): string
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true
    return name && state ? `${statePrefix}${name}` : ''
  }

  return {
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
  }
}
