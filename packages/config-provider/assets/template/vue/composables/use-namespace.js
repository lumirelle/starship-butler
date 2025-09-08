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
function _bem(block, blockSuffix, element, modifier) {
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

/**
 * @typedef {object} UseNamespaceReturn
 * @property {(blockSuffix?: string) => string} b - Generate a block class name
 * @property {(element?: string) => string} e - Generate an element class name
 * @property {(modifier?: string) => string} m - Generate a modifier class name
 * @property {(blockSuffix?: string, element?: string) => string} be - Generate a block-element class name
 * @property {(element?: string, modifier?: string) => string} em - Generate an element-modifier class name
 * @property {(blockSuffix?: string, modifier?: string) => string} bm - Generate a block-modifier class name
 * @property {(blockSuffix?: string, element?: string, modifier?: string) => string} bem - Generate a block-element-modifier class name
 * @property {{ (name: string, state: boolean | undefined): string; (name: string): string }} is - Generate a state class name
 */

/**
 * @type {(block: string) => UseNamespaceReturn}}
 */
export function useNamespace(block) {
  const b = (blockSuffix = '') =>
    _bem(block, blockSuffix, '', '')
  const e = element =>
    element ? _bem(block, '', element, '') : ''
  const m = modifier =>
    modifier ? _bem(block, '', '', modifier) : ''
  const be = (blockSuffix, element) =>
    blockSuffix && element
      ? _bem(block, blockSuffix, element, '')
      : ''
  const em = (element, modifier) =>
    element && modifier
      ? _bem(block, '', element, modifier)
      : ''
  const bm = (blockSuffix, modifier) =>
    blockSuffix && modifier
      ? _bem(block, blockSuffix, '', modifier)
      : ''
  const bem = (blockSuffix, element, modifier) =>
    blockSuffix && element && modifier
      ? _bem(block, blockSuffix, element, modifier)
      : ''
  const is = (name, ...args) => {
    const state = args.length >= 1 ? args[0] : true
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
