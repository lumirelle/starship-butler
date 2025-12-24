import { homedir as _homedir } from 'node:os'
import process from 'node:process'
import { join as _join } from 'pathe'

export { basename } from 'pathe'

/**
 * Join all arguments together and normalize the resulting path, starting from home directory.
 *
 * @param paths Paths to join.
 * @returns Joined paths.
 * @throws {TypeError} if any of the path segments is not a string.
 */
export const join = _join

/**
 * Join all arguments together and normalize the resulting path, starting from home directory.
 *
 * @param paths Paths to join.
 * @returns Joined paths.
 * @throws {TypeError} if any of the path segments is not a string.
 */
export function homedir(...paths: string[]): string {
  return join(_homedir(), ...paths)
}

/**
 * Join all arguments together and normalize the resulting path, starting from appdata directory.
 *
 * @param paths Paths to join.
 * @returns Joined paths.
 * @throws {TypeError} if any of the path segments is not a string.
 */
export function appdata(...paths: string[]): string {
  return join(process.env.APPDATA!, ...paths)
}

/**
 * Join all arguments together and normalize the resulting path, starting from local appdata directory.
 *
 * @param paths Paths to join.
 * @returns Joined paths.
 * @throws {TypeError} if any of the path segments is not a string.
 */
export function localAppdata(...paths: string[]): string {
  return join(process.env.LOCALAPPDATA!, ...paths)
}
