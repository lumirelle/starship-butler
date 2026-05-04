import {
  constants,
  copyFileSync,
  lstatSync,
  mkdirSync,
  renameSync,
  rmSync,
  symlinkSync,
} from 'node:fs'
import { consola } from 'consola'
import { info } from './highlight'

const PATH_ENDS_WITH_SEP = /[/\\]$/
/**
 * Check if a path exists. Does not dereference symlinks.
 *
 * If the path ends with `/` or `\`, it will be treated as a directory path, so that it will only match existing directories.
 *
 * @param path The path to check.
 * @returns Whether the path exists.
 */
export function exists(path: string): boolean {
  try {
    // If path does not exist, lstatSync will throw an `ENOENT` or `ENOTDIR` error
    const status = lstatSync(path)
    // If the path ends with `/` or `\`, we consider it as a directory path,
    // so we only match existing directories,
    // this can help us get consistent behavior between Windows & Unix
    if (PATH_ENDS_WITH_SEP.test(path) && !status.isDirectory())
      return false
    return true
  }
  catch (error) {
    // If we get an `ENOENT` or `ENOTDIR` error, we consider the path does not exist
    if (error instanceof Error && ['ENOENT', 'ENOTDIR'].some(code => error.message.includes(code)))
      return false
    // For other errors (e.g. permission denied), we re-throw the error to let the caller handle it
    throw error
  }
}

/**
 * Check if a path is a directory.
 *
 * If the path exists, we check the stats, if not, we check if the path ends
 * with `/` or `\`.
 *
 * @param path The path to check.
 * @returns Whether the path is a directory.
 */
export function isDirectory(path: string): boolean {
  return PATH_ENDS_WITH_SEP.test(path) || (exists(path) && lstatSync(path).isDirectory())
}

/**
 * Check if a path is a symbolic link.
 *
 * If the path exists, we check the stats, if not, we treat it as a non-symbolic link.
 *
 * @param path The path to check.
 * @returns Whether the path is a symbolic link.
 */
export function isSymbolicLink(path: string): boolean {
  return exists(path) && lstatSync(path).isSymbolicLink()
}

/**
 * Ensure a directory exists.
 *
 * - If the path exists but is not a directory, return false.
 * - If the path does not exist, create the directory and get fails, return false.
 * - Otherwise, return true.
 *
 * @param path The path to ensure.
 * @returns `true` if the path is a directory and exists at the end, `false` otherwise.
 */
export function ensureDirectory(path: string): boolean {
  try {
    if (exists(path))
      return isDirectory(path)
    mkdirSync(path, { recursive: true })
    return true
  }
  catch (error) {
    console.error(error)
    return false
  }
}

/**
 * Remove a path.
 *
 * @param path The path to remove.
 * @param recursive Whether to remove (directories) recursively. If `false`, removing a directory will fail with an error.
 * @returns `true` if the file was removed, `false` otherwise.
 */
export function remove(path: string, recursive = false): boolean {
  if (!exists(path)) {
    consola.warn(`REMOVE: Path not exists: ${info(path)}, skip`)
    return false
  }
  try {
    rmSync(path, { recursive })
    return true
  }
  catch (error) {
    console.error(error)
    return false
  }
}

/**
 * Copy a file.
 *
 * @param sourcePath The path to the source file.
 * @param targetPath The path to the target file.
 * @param force Whether to force overwrite the target file.
 * @returns Whether the file was copied.
 */
export function copyFile(sourcePath: string, targetPath: string, force = false): boolean {
  const isExist = exists(targetPath)
  if (isExist) {
    if (!force) {
      consola.warn(`COPY: Path already exists: ${info(targetPath)}, skip`)
      return false
    }
    renameSync(targetPath, `${targetPath}.bak`)
  }
  try {
    copyFileSync(
      sourcePath,
      targetPath,
      force ? constants.COPYFILE_FICLONE : constants.COPYFILE_EXCL,
    )
    if (isExist) {
      remove(`${targetPath}.bak`)
    }
  }
  catch (error) {
    if (isExist) {
      renameSync(`${targetPath}.bak`, targetPath)
    }
    throw error
  }
  return true
}

/**
 * Create a symbolic link.
 *
 * @param sourcePath The path to the source file.
 * @param targetPath The path to the target symlink.
 * @param force Whether to force overwrite the target symlink.
 * @returns Whether the symlink was created.
 */
export function createSymlink(sourcePath: string, targetPath: string, force = false): boolean {
  const isExist = exists(targetPath)
  if (isExist) {
    if (!force) {
      consola.warn(`LINK: Path already exists: ${info(targetPath)}, skip`)
      return false
    }
    renameSync(targetPath, `${targetPath}.bak`)
  }
  try {
    symlinkSync(sourcePath, targetPath, 'file')
    if (isExist) {
      remove(`${targetPath}.bak`)
    }
  }
  catch (error) {
    if (isExist) {
      renameSync(`${targetPath}.bak`, targetPath)
    }
    throw error
  }
  return true
}

/**
 * Remove a symbolic link.
 *
 * If the path is not a symlink, a warning will be logged and the function will
 * return false.
 *
 * @param path The path to remove.
 * @returns `true` if the symlink was removed, `false` otherwise.
 */
export function removeSymlink(path: string): boolean {
  if (!isSymbolicLink(path)) {
    consola.warn(`REMOVE: Path is not a symlink: ${info(path)}, skip`)
    return false
  }
  return remove(path)
}
