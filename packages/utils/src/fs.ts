import { constants, copyFileSync, promises as fsPromises, lstatSync, mkdirSync, unlinkSync } from 'node:fs'
import { dirname } from 'node:path'
import consola from 'consola'
import { highlight } from './highlight'

/**
 * Check if a file or directory exists. Does not dereference symlinks.
 * @param path - The path to check
 * @returns `true` if the file or directory exists, `false` otherwise
 */
export function existsSync(path: string): boolean {
  try {
    lstatSync(path)
    return true
  }
  catch (error) {
    if (error instanceof Error && error.message.includes('ENOENT')) {
      return false
    }
    else {
      throw error
    }
  }
}

/**
 * Check if a path is a directory. If path exists, we check the stats, if not, we check if the path ends with `/` or `\`.
 * @param path - The path to check
 * @returns `true` if the path is a directory, `false` otherwise
 */
export function isDirectory(path: string): boolean {
  return (existsSync(path) && lstatSync(path).isDirectory()) || path.match(/\/$|\\$/) !== null
}

/**
 * Ensure a directory exists.
 * If the path is not a directory, we will try to create it.
 * If the path is a file, we will create the parent directory.
 * @param dirPath - The path to ensure
 * @returns `true` if the directory is created, `false` otherwise
 */
export function ensureDir(dirPath: string): boolean {
  if (!isDirectory(dirPath)) {
    dirPath = dirname(dirPath)
  }
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
    return true
  }
  return false
}

export async function createSymlink(sourcePath: string, targetPath: string, force = false): Promise<boolean> {
  if (existsSync(targetPath)) {
    if (force) {
      unlinkSync(targetPath)
    }
    else {
      consola.warn(`LINK: File already exists: ${highlight.info(targetPath)}, skip`)
      return false
    }
  }

  await fsPromises.symlink(sourcePath, targetPath, 'file')
  return true
}

export function removeSymlink(targetPath: string): boolean {
  if (!existsSync(targetPath)) {
    consola.warn(`UNLINK: Target file not found: ${highlight.info(targetPath)}, skip`)
    return false
  }

  const stats = lstatSync(targetPath)
  if (!stats.isSymbolicLink()) {
    consola.warn(`UNLINK: Target file is not a symlink: ${highlight.info(targetPath)}, skip`)
    return false
  }

  unlinkSync(targetPath)
  return true
}

export function copyFile(sourcePath: string, targetPath: string, force: boolean = false): boolean {
  if (existsSync(targetPath) && !force) {
    consola.warn(`COPY: File already exists: ${highlight.info(targetPath)}, skip`)
    return false
  }

  copyFileSync(sourcePath, targetPath, force ? constants.COPYFILE_FICLONE : constants.COPYFILE_EXCL)
  return true
}

export function removeFile(targetPath: string): boolean {
  if (!existsSync(targetPath)) {
    consola.warn(`REMOVE: Target file not found: ${highlight.info(targetPath)}, skip`)
    return false
  }

  unlinkSync(targetPath)
  return true
}
