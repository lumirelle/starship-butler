import { readUser as readUserRc, updateUser as updateUserRc, writeUser as writeUserRc } from 'rc9'

/**
 * Updates or creates a user rc file (rc file under home directory).
 * @param name The name of the rc file.
 * @param config The rc to write.
 */
export function upsertUserRc(name: string, config: any): void {
  const rc = readUserRc(name)
  if (!rc) {
    writeUserRc(config, name)
  }
  else {
    updateUserRc(config, name)
  }
}
